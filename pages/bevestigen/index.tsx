import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

export default function Bevestigen() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"init" | "form" | "done">("init");
  const [offerteId, setOfferteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    setOfferteId(id);
  }, [searchParams]);

  const handleConfirmClick = () => {
    setStep("form");
  };

  const handleSubmit = () => {
    if (name && email && sigCanvas.current && !sigCanvas.current.isEmpty() && offerteId) {
      const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      console.log("Offerte bevestigd:", {
        offerteId,
        name,
        email,
        signature: signatureDataUrl,
      });
      setStep("done");
    } else {
      alert("Vul alle velden in en teken je handtekening.");
    }
  };

  const handleClear = () => {
    sigCanvas.current?.clear();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Offerte Bevestigen</h1>
          <p className="text-gray-500 text-sm mt-1">Controleer de gegevens en bevestig deze offerte.</p>
        </header>

        {step === "init" && (
          <>
            <div className="text-left mb-6">
              <p className="text-gray-700 mb-2">U staat op het punt om offerte <span className="font-mono font-semibold">{offerteId}</span> te bevestigen.</p>
              <p className="text-gray-600 text-sm">Door op onderstaande knop te klikken, gaat u akkoord met de inhoud van de offerte.</p>
            </div>
            <button
              onClick={handleConfirmClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition"
            >
              Bevestig deze offerte
            </button>
          </>
        )}

        {step === "form" && (
          <div className="text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Naam</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-xl p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mailadres</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-xl p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Digitale handtekening</label>
              <div className="border border-gray-300 rounded-xl overflow-hidden">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ className: "w-full h-40 bg-white" }}
                />
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Wis handtekening
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition"
            >
              Bevestiging versturen
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center">
            <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bedankt voor je bevestiging!</h2>
            <p className="text-gray-600">Offerte-ID: <span className="font-mono">{offerteId}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

