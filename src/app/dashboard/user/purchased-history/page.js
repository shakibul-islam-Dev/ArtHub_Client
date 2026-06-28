"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Table, Spinner } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import {
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

const PurchasedHistoryPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const apiUrl = process.env.NEXT_PUBLIC_URL;

  // States
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [verifyMessage, setVerifyMessage] = useState("");

  useEffect(() => {
    const handlePaymentAndFetchHistory = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);

        if (sessionId) {
          setVerifyStatus("verifying");
          setVerifyMessage("Verifying your payment, please wait...");

          const verifyRes = await fetch(
            `${apiUrl}/api/arthub/checkout/confirm-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            },
          );
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setVerifyStatus("success");
            setVerifyMessage(
              "Thank you! Payment verified and artwork secured.",
            );
          } else {
            setVerifyStatus("error");
            setVerifyMessage(
              verifyData.message || "Payment verification failed.",
            );
          }
        }

        const historyRes = await fetch(
          `${apiUrl}/api/arthub/checkout/history/${session.user.id}`,
        );
        const historyData = await historyRes.json();

        if (historyData.success) {
          setPurchases(historyData.data);
        }
      } catch (err) {
        console.error("Error in history page:", err);
        setVerifyStatus("error");
        setVerifyMessage(
          "Something went wrong while connecting to the server.",
        );
      } finally {
        setLoading(false);
      }
    };

    handlePaymentAndFetchHistory();
  }, [session?.user?.id, sessionId, apiUrl]);

  if (sessionLoading || (loading && purchases.length === 0 && !verifyStatus)) {
    return (
      <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-white dark:bg-neutral-950">
        <Spinner size="lg" color="primary" />
        <span className="text-sm text-neutral-500">
          Loading your purchase records...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen transition-colors duration-300">
      {/* Header section */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          Purchase History
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          A detailed record of all your acquired art pieces and transactions.
        </p>
      </div>

      {verifyStatus && verifyStatus !== "verifying" && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 border ${
            verifyStatus === "success"
              ? "bg-emerald-50/60 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400"
              : "bg-red-50/60 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400"
          }`}
        >
          {verifyStatus === "success" ? (
            <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
          ) : (
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
          )}
          <div>
            <p className="text-sm font-bold">
              {verifyStatus === "success" ? "Success!" : "Verification Notice"}
            </p>
            <p className="text-xs mt-0.5 opacity-90">{verifyMessage}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden p-2">
        <Table>
          <Table.ScrollContainer className="w-full overflow-x-auto no-scrollbar">
            <Table.Content
              aria-label="Purchase history table"
              className="min-w-[800px] text-neutral-800 dark:text-neutral-200"
            >
              <Table.Header className="bg-neutral-50 dark:bg-neutral-900">
                <Table.Column
                  isRowHeader
                  className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5"
                >
                  Artwork Name
                </Table.Column>
                <Table.Column className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5">
                  Artist
                </Table.Column>
                <Table.Column className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5">
                  Price
                </Table.Column>
                <Table.Column className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5">
                  Purchase Date
                </Table.Column>
              </Table.Header>

              <Table.Body
                emptyContent={"You haven't purchased any artwork yet."}
              >
                {purchases.map((item) => {
                  const artworkTitle =
                    item.artworkId?.title || "Deleted Artwork";
                  const artworkImage =
                    item.artworkId?.imageUrl ||
                    item.artworkId?.image_url ||
                    null;
                  const artistName =
                    item.artworkId?.artistName || "Unknown Artist";

                  return (
                    <Table.Row
                      key={item._id}
                      className="border-b border-neutral-100 dark:border-neutral-900 last:border-none hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      {/* Artwork Info */}
                      <Table.Cell className="font-medium text-neutral-950 dark:text-neutral-100 py-4">
                        <div className="flex items-center gap-3">
                          {artworkImage ? (
                            <div className="relative w-10 h-10 shrink-0">
                              <Image
                                src={artworkImage}
                                alt={artworkTitle}
                                fill
                                sizes="40px"
                                className="object-cover rounded-lg border border-neutral-200 dark:border-neutral-800"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-600">
                              <ImageIcon size={16} />
                            </div>
                          )}
                          <span>{artworkTitle}</span>
                        </div>
                      </Table.Cell>

                      {/* Artist Name */}
                      <Table.Cell className="text-neutral-600 dark:text-neutral-400">
                        {artistName}
                      </Table.Cell>

                      {/* Price */}
                      <Table.Cell className="font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="flex items-center gap-0.5">
                          <DollarSign size={14} />
                          {item.amount}
                        </span>
                      </Table.Cell>

                      {/* Formatted Date */}
                      <Table.Cell className="text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="opacity-70" />
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
};

export default PurchasedHistoryPage;
