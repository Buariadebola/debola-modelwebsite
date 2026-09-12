import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const Payment = ({ isOpen, onClose }) => {
  const [copiedAddress, setCopiedAddress] = useState(null);
  const navigate = useNavigate()

  const cryptoDetails = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: '1A1z7agoat91xZgVn5HCaxLUpG5zTCNjhX',
      mark: '₿',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f42bE5',
      mark: 'Ξ',
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      address: 'ATokenkLvnwEmCh7UsLccjZawn7S6GVZxksrx6oTKk9w',
      mark: 'S',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      mark: '$',
    },
  ];

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(id);

      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <AnimatePresence>
        <motion.div
          className="flex items-center h-screen justify-center bg-pink-800 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[98vh] w-full max-w-2xl flex-col overflow-hidden bg-pink-50 shadow-[0_30px_100px_rgba(84,29,74,0.30)]"
          >
            <div className="h-1 w-full bg-[linear-gradient(135deg,#f472b6,#8b5cf6)]" />

            <div className="border-b border-[#f0dff1] px-6 py-5 sm:px-9 sm:py-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#bf82b9]" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8f6888]">
                      Secure Payment
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl font-light leading-none tracking-[-0.02em] text-[#311a32] sm:text-4xl">
                    Cryptocurrency
                    <span className="ml-1 not-sm:block italic text-[#8f6888]">
                      payment.
                    </span>
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-[#725a75]">
                    Choose your preferred cryptocurrency and send the payment
                    to the corresponding wallet address below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  aria-label="Close payment modal"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center border border-[#efd9ee] bg-[#fff5fb] text-[#5f3d5d] transition-all duration-300 hover:border-[#d96bb4] hover:bg-[#fff0fb]"
                >
                  <X className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-[#f0dff1] pt-5">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#9b7a90]">
                  Accepted currencies
                </span>

                <span className="text-[9px] uppercase tracking-[0.25em] text-[#9b7a90]">
                  BTC · ETH · SOL · USDC
                </span>
              </div>
            </div>

            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-pink-400 px-6 py-6 sm:px-9 sm:py-8">
              <div className="space-y-3">
                {cryptoDetails.map((crypto, index) => {
                  const isCopied = copiedAddress === crypto.symbol;

                  return (
                    <motion.div
                      key={crypto.symbol}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.45,
                      }}
                      className="group border border-[#efd9ee] bg-white p-5 transition-all duration-300 hover:border-[#d96bb4] hover:shadow-[0_12px_35px_rgba(168,104,185,0.10)] sm:p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center border border-[#efd9ee] bg-[#fff7fb] font-serif text-xl text-[#311a32]">
                            {crypto.mark}
                          </div>

                          <div>
                            <h3 className="font-serif text-lg font-medium text-[#311a32]">
                              {crypto.name}
                            </h3>

                            <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-[#9b7a90]">
                              {crypto.symbol}
                            </p>
                          </div>
                        </div>

                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#d9bfd8]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center gap-3 border border-[#f0dff1] bg-[#fff9fc] p-3">
                        <code className="min-w-0 flex-1 break-all font-mono text-[10px] leading-5 text-[#5f3d5d] sm:text-xs">
                          {crypto.address}
                        </code>

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              crypto.address,
                              crypto.symbol
                            )
                          }
                          aria-label={`Copy ${crypto.name} wallet address`}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-300 ${
                            isCopied
                              ? 'border-[#311a32] bg-[#311a32] text-white'
                              : 'border-[#efd9ee] bg-white text-[#5f3d5d] hover:border-[#d96bb4] hover:text-[#311a32]'
                          }`}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`text-[9px] uppercase tracking-[0.18em] transition-colors ${
                            isCopied
                              ? 'text-[#311a32]'
                              : 'text-[#8f6888]'
                          }`}
                        >
                          {isCopied
                            ? 'Wallet address copied'
                            : 'Copy wallet address'}
                        </span>

                        <ArrowUpRight
                          className={`h-3.5 w-3.5 transition-all duration-300 ${
                            isCopied
                              ? 'text-[#311a32]'
                              : 'text-pink-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pink-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: cryptoDetails.length * 0.08 + 0.1,
                  duration: 0.45,
                }}
                className="mt-6 border border-[#efd9ee] bg-pink-900 p-5 text-white sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/20 text-xs">
                    !
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/85">
                      Important
                    </p>

                    <p className="mt-2 text-xs leading-5 text-white/80">
                      Verify the wallet address and network carefully before
                      sending your payment. Cryptocurrency transactions are
                      generally irreversible.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-300 bg-pink-200 px-6 py-5 sm:px-9">
              <div className="flex items-center justify-between gap-4">
                <div className="hidden sm:block">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                    Payment / Crypto
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="group flex w-full items-center justify-center gap-3 bg-pink-800 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-pink-600 sm:w-auto"
                >
                  Close
                  <X className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

export default Payment;