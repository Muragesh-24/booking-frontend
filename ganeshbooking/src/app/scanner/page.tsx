"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, RefreshCcw, ScanLine, ShieldAlert, ShieldCheck, TicketCheck } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Toaster, toast } from "sonner";

import ProtectedAdminRoute from "@/components/ui/adminprotector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type BookingLookup = {
  id?: number;
  name?: string;
  email?: string;
  utr?: string;
  status?: string;
  is_verified?: boolean;
  total?: number;
};

function extractUtr(scanText: string) {
  const trimmed = scanText.trim();

  try {
    const maybeUrl = new URL(trimmed);
    return maybeUrl.searchParams.get("utr") || maybeUrl.searchParams.get("query") || maybeUrl.pathname.split("/").filter(Boolean).pop() || trimmed;
  } catch {
    const match = trimmed.match(/(?:utr|query)=([A-Za-z0-9_-]+)/i);
    if (match?.[1]) {
      return match[1];
    }
    return trimmed;
  }
}

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string>("");
  const [cameraState, setCameraState] = useState<"idle" | "scanning" | "error">("idle");
  const [cameraPermission, setCameraPermission] = useState<"idle" | "prompting" | "granted" | "denied">("idle");
  const [manualValue, setManualValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingLookup | null>(null);
  const [entryMessage, setEntryMessage] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastUtrRef = useRef("");
  const submittingRef = useRef(false);

  const getAdminToken = useCallback(() => {
    return localStorage.getItem("adminToken") || "";
  }, []);

  const updateEntry = useCallback(
    async (rawValue: string) => {
      const utr = extractUtr(rawValue);
      if (!utr) {
        toast.error("QR code did not contain a valid booking reference");
        return;
      }

      if (submittingRef.current && utr === lastUtrRef.current) {
        return;
      }

      submittingRef.current = true;
      setSubmitting(true);
      setEntryMessage("");
      setBookingData(null);

      try {
        const token = getAdminToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/enter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ utr }),
        });

        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          data?: BookingLookup;
          message?: string;
          already_entered?: boolean;
        };
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to mark entry");
        }

      lastUtrRef.current = utr;
        setScanResult(utr);
        setBookingData(data.data || { utr });
        if (data.already_entered || data.data?.status?.toLowerCase() === "present") {
          setEntryMessage(`Already entered for ${data.data?.name || utr}`);
          toast.message("Already entered");
        } else {
          setEntryMessage(`Entry marked successfully for ${data.data?.name || utr}`);
          toast.success("Entry marked successfully");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Check-in failed";
        setEntryMessage(message);
        toast.error(message);
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [getAdminToken]
  );

  const requestCameraPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraPermission("denied");
      setCameraState("error");
      return false;
    }

    try {
      setCameraPermission("prompting");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.getTracks().forEach((track) => track.stop());
      setCameraPermission("granted");
      return true;
    } catch (error) {
      console.error(error);
      setCameraPermission("denied");
      setCameraState("error");
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const permitted = await requestCameraPermission();
        if (!permitted) {
          return;
        }

        scannerRef.current = new Html5Qrcode("qr-reader");
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (decodedText) => {
            if (mounted) {
              const utr = extractUtr(decodedText);
              setScanResult(utr);
              void updateEntry(utr);
            }
          },
          () => undefined
        );
        if (mounted) setCameraState("scanning");
      } catch (error) {
        console.error(error);
        if (mounted) setCameraState("error");
      }
    };

    void startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current?.isScanning) {
        void scannerRef.current.stop().catch(() => undefined);
      }
    };
  }, [requestCameraPermission, updateEntry]);

  const handleManualEntry = async () => {
    await updateEntry(manualValue);
  };

  const handleRescan = async () => {
    setScanResult("");
    setManualValue("");
    setEntryMessage("");
    setBookingData(null);

    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
      scannerRef.current = null;
      setCameraState("idle");
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const checkInState = useMemo(() => {
    if (!scanResult) {
      return null;
    }
    if (bookingData?.status?.toLowerCase() === "present") {
      return { type: "warning" as const, title: "Already checked in", text: "This ticket has already been marked as present." };
    }
    return { type: "success" as const, title: "Entry ready", text: "Ticket matched successfully. Confirm identity and allow entry." };
  }, [scanResult, bookingData?.status]);

  const resultTone = checkInState?.type === "success" ? "success" : checkInState?.type === "warning" ? "warning" : "destructive";

  return (
    <ProtectedAdminRoute>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(180,83,9,0.12),transparent_32%),linear-gradient(180deg,#fffaf3_0%,#f8eedc_100%)] px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-[2rem] bg-stone-950 px-6 py-8 text-white shadow-[0_24px_80px_rgba(29,22,15,0.26)]">
            <p className="text-sm uppercase tracking-[0.28em] text-amber-200">Volunteer check-in</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">QR scanner station</h1>
            <p className="mt-4 max-w-3xl text-stone-300">
              Scan event passes at the gate, verify the ticket status, and confirm entry using the check-in workflow.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Camera scanner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-[1.5rem] border border-amber-950/10 bg-stone-950 p-3">
                  <div id="qr-reader" className="min-h-[320px] rounded-[1.25rem] bg-stone-900" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={requestCameraPermission} disabled={cameraPermission === "prompting"}>
                    <Camera className="h-4 w-4" />
                    {cameraPermission === "prompting"
                      ? "Requesting camera permission..."
                      : cameraPermission === "granted"
                      ? "Camera allowed"
                      : "Allow camera access"}
                  </Button>
                  <Button onClick={handleRescan}>
                    <RefreshCcw className="h-4 w-4" /> Rescan
                  </Button>
                  <Button variant="outline" onClick={handleManualEntry} disabled={submitting}>
                    <ScanLine className="h-4 w-4" /> Use manual value
                  </Button>
                </div>
                {cameraState === "error" ? (
                  <div className="rounded-3xl border border-amber-950/10 bg-amber-50 p-4 text-sm text-amber-900">
                    Camera access is unavailable. Click &quot;Allow camera access&quot; again, or use the manual entry field to test verification responses.
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-stone-600">
                  <p>1. Hold the ticket QR in front of the camera.</p>
                  <p>2. Confirm the scanned code with the attendee details shown below.</p>
                  <p>3. Mark the person as checked in only after visual identity confirmation.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual verification response</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    placeholder="Paste booking token, UTR, or QR text"
                  />
                  {checkInState ? (
                    <div className="rounded-[1.5rem] border border-amber-950/10 bg-white/80 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-stone-500">Verification result</p>
                          <p className="mt-1 text-xl font-semibold text-stone-950">{checkInState.title}</p>
                        </div>
                        {checkInState.type === "success" ? (
                          <ShieldCheck className="h-6 w-6 text-emerald-700" />
                        ) : (
                          <ShieldAlert className="h-6 w-6 text-amber-700" />
                        )}
                      </div>
                      <div className="mt-4">
                        <Badge variant={resultTone}>{checkInState.type}</Badge>
                        <p className="mt-3 text-sm text-stone-600">{checkInState.text}</p>
                        <div className="mt-4 rounded-2xl bg-stone-950 px-4 py-3 text-sm text-white">
                          <p className="font-medium">Booking reference: {bookingData?.utr || scanResult}</p>
                          <p className="mt-1 text-stone-300">
                            {bookingData?.name ? `${bookingData.name} ${bookingData.email ? `(${bookingData.email})` : ""}` : "User details loaded from the backend."}
                          </p>
                          {bookingData?.total !== undefined ? <p className="mt-1 text-stone-300">Total tickets: {bookingData.total}</p> : null}
                          {bookingData?.status ? <p className="mt-1 text-stone-300">Status: {bookingData.status}</p> : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-amber-950/15 p-6 text-sm text-stone-600">
                      No ticket has been scanned yet.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scanner status</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3 text-sm text-stone-600">
                  <Camera className="h-4 w-4 text-amber-800" />
                  {submitting
                    ? "Marking entry..."
                    : cameraState === "scanning"
                    ? "Camera active"
                    : cameraState === "error"
                    ? "Camera unavailable"
                    : "Initializing scanner"}
                </CardContent>
              </Card>

              {entryMessage ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Latest entry result</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-stone-600">
                    <div className="flex items-center gap-2 rounded-2xl border border-amber-950/10 bg-white/80 px-4 py-3">
                      <TicketCheck className="h-4 w-4 text-emerald-700" />
                      {entryMessage}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
