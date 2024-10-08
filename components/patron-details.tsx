import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn, dateFormat, PatronWithSub, sr_id } from "@/lib/utils";

import { FootfallDialog } from "./footfall-form";

import {
  Bike,
  BookOpen,
  CircleAlert,
  Fingerprint,
  Gauge,
  GitPullRequestCreateArrow,
  HardDriveDownload,
  HardDriveUpload,
  Library,
  Mail,
  TimerReset,
  Truck,
} from "lucide-react";

export function PatronDetails({
  patron,
  readOnly,
  className,
}: {
  patron: PatronWithSub;
  readOnly?: boolean;
  className?: string;
}) {
  const today = new Date();
  const active_addons = patron.addons.filter((a) => a.expiryDate > today);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          <Link href={`/patrons/${patron.id}`}>
            <Button className="text-lg font-semibold" variant="outline">
              {patron.name}
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between flex-wrap gap-1">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-normal flex items-center">
              <Gauge className="w-4" />
              <span className="pl-2 font-semibold">
                {patron.subscription?.closed ? (
                  <span className="text-gray-500">CLOSED</span>
                ) : patron.subscription?.expiryDate! >= new Date() ? (
                  <span className="text-blue-500">ACTIVE</span>
                ) : (
                  <span className="text-red-500">EXPIRED</span>
                )}
              </span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <Fingerprint className="w-4" />
              <span className="pl-2">{sr_id(patron.id)}</span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <Mail className="w-4" />
              <span className="pl-2">{patron.email}</span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <Library className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">Plan: </span>
                {`${patron.subscription?.plan} Books`}
              </span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <TimerReset className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">{`Expires on: `}</span>
                <span className={`${patron.subscription!.expiryDate < today && "text-red-500 font-semibold"}`}>
                  {patron.subscription?.expiryDate.toLocaleDateString(
                    "en-IN",
                    dateFormat,
                  )}
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-normal flex items-center">
              <BookOpen className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">In hand: </span>
                {`${patron.subscription?.booksInHand || 0} Books`}
              </span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <HardDriveUpload className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">{`Last Issued: `}</span>
                {patron.subscription?.lastIssued
                  ? patron.subscription.lastIssued.toLocaleDateString(
                      "en-IN",
                      dateFormat,
                    )
                  : "Unavailable"}
              </span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <HardDriveDownload className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">{`Last Returned: `}</span>
                {patron.subscription?.lastReturned
                  ? patron.subscription.lastReturned.toLocaleDateString(
                      "en-IN",
                      dateFormat,
                    )
                  : "Unavailable"}
              </span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <Bike className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">Free Delivery: </span>
                {`${patron.subscription?.freeDD || 0}`} /{" "}
                {`${patron.subscription?.monthlyDD || 0}`}
              </span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <Truck className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">Paid Delivery: </span>
                {`${patron.subscription?.paidDD || 0}`}
              </span>
            </div>
          </div>
        </div>
        {!!patron.subscription!.closed && (
          <div className="my-2 p-2 border border-gray-200 rounded-sm">
            <div className="text-sm font-normal flex items-center">
              <CircleAlert className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">Closing Date: </span>
                {patron.subscription?.closedDate
                  ? patron.subscription.closedDate.toLocaleDateString(
                      "en-IN",
                      dateFormat,
                    )
                  : "Unavailable"}
              </span>
            </div>
          </div>
        )}
        {!!patron.remarks && (
          <div className="my-2 p-2 border border-gray-200 rounded-sm">
            <div className="text-sm font-normal flex items-center">
              <CircleAlert className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">Remarks: </span>
                {patron.remarks}
              </span>
            </div>
          </div>
        )}
        {active_addons.map((addon) => (
          <div
            key={addon.id}
            className="my-2 p-2 border border-gray-200 rounded-sm"
          >
            <div className="text-sm font-normal flex items-center">
              <GitPullRequestCreateArrow className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">Addon Plan: </span>
                {`${addon.plan || 0}`}
              </span>
            </div>
            <div className="text-sm font-normal flex items-center">
              <TimerReset className="w-4" />
              <span className="pl-2">
                <span className="font-semibold">{`Addon Expiry: `}</span>
                {addon.expiryDate.toLocaleDateString("en-IN", dateFormat)}
              </span>
            </div>
          </div>
        ))}

        {!readOnly && (
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <Link
              href={`/patrons/${patron.id}/${patron.subscription!.closed ? "reopen" : "renew"}`}
              className="basis-1/3"
            >
              <Button variant="default" className="w-full">
                {patron.subscription!.closed ? "Reopen" : "Renew"}
              </Button>
            </Link>
            <FootfallDialog
              disabled={patron.subscription!.closed}
              className="basis-1/3"
              patron={patron}
            />
            <Link
              href={`/patrons/${patron.id}/misc`}
              aria-disabled={patron.subscription!.closed}
              className="basis-1/3"
            >
              <Button
                variant="default"
                disabled={patron.subscription!.closed}
                className="w-full"
              >
                Misc
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
