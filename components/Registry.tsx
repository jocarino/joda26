interface RegistryProps {
  variant?: "default" | "secondary";
}

export default function Registry({ variant = "default" }: RegistryProps) {
  const isSecondary = variant === "secondary";
  const containerClasses = isSecondary
    ? "text-center bg-[#5a6134] text-white py-8 px-4 rounded"
    : "text-center";

  return (
    <div className={containerClasses}>
      <p
        className={`text-sm mb-4 text-justify ${
          isSecondary ? "text-white/90" : "text-gray-600"
        }`}
      >
        As we will be travelling back to the UK shortly after the celebration,
        we will unfortunately be unable to transport physical or boxed gifts.
      </p>
      <p
        className={`text-sm mb-4 text-justify ${
          isSecondary ? "text-white/90" : "text-gray-600"
        }`}
      >
        Your presence at our wedding would mean the world to us, but for guests
        who wish to honour us with a gift we would appreciate monetary gifts as
        they will be much easier for us to receive and carry with us.
      </p>
      <p
        className={`text-sm mb-4 text-justify ${
          isSecondary ? "text-white/90" : "text-gray-600"
        }`}
      >
        Kindly find our account details below. Thank you for your love,
        generosity, and for celebrating this special moment with us.
      </p>

      <div className="space-y-6 mt-8">
        {/* Naira Account */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4 text-center">
            NAIRA ACCOUNT
          </h4>
          <div className="space-y-2 max-w-md mx-auto text-sm">
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                Account No:
              </span>
              <span className="font-semibold">0793202713</span>
            </div>
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                Bank:
              </span>
              <span className="font-semibold">Access Bank</span>
            </div>
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                Name:
              </span>
              <span className="font-semibold">Olaleye Oluwadamola</span>
            </div>
          </div>
        </div>

        {/* Pounds Account */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4 text-center">
            POUNDS ACCOUNT
          </h4>
          <div className="space-y-2 max-w-md mx-auto text-sm">
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                Account holder name:
              </span>
              <span className="font-semibold">Oluwadamola Olaleye</span>
            </div>
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                Account number:
              </span>
              <span className="font-semibold">60013714</span>
            </div>
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                Sort code:
              </span>
              <span className="font-semibold">20-26-78</span>
            </div>
          </div>
        </div>

        {/* Portuguese Account */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4 text-center">
            EUROS ACCOUNT
          </h4>
          <div className="space-y-2 max-w-md mx-auto text-sm">
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                Nome de cliente:
              </span>
              <span className="font-semibold">Joao Veloso</span>
            </div>
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                CONTA:
              </span>
              <span className="font-semibold">0836002473400</span>
            </div>
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                IBAN:
              </span>
              <span className="font-semibold">PT50003508360000247340011</span>
            </div>
            <div className="flex justify-between">
              <span className={isSecondary ? "text-white/80" : "text-gray-600"}>
                BIC SWIFT:
              </span>
              <span className="font-semibold">CGDIPTPL</span>
            </div>
          </div>
        </div>

        {/* PayPal */}
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4 text-center">PAYPAL</h4>
          <div className="text-center">
            <a
              href="https://paypal.me/JVeloso58"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline inline-block"
            >
              paypal.me/JVeloso58
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
