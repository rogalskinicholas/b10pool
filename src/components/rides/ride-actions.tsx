"use client";

import { useTransition } from "react";
import { Ban, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adjustSeats, deleteRide, updateRideStatus } from "@/app/rides/actions";
import type { MyRide } from "@/lib/rides/queries";

export function RideActions({ ride }: { ride: MyRide }) {
  const [pending, startTransition] = useTransition();

  const run = (task: () => Promise<{ error?: string }>, success: string) =>
    startTransition(async () => {
      const result = await task();
      if (result.error) toast.error(result.error);
      else toast.success(success);
    });

  const cancelled = ride.status === "cancelled";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!cancelled && (
        <div className="inline-flex items-center rounded-lg border">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="One fewer seat"
            disabled={pending || ride.seats_available === 0}
            onClick={() => run(() => adjustSeats(ride.id, -1), "Seat count updated")}
          >
            <Minus />
          </Button>
          <span className="min-w-14 text-center text-xs tabular-nums">
            {ride.seats_available}/{ride.seats_total} left
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="One more seat"
            disabled={pending || ride.seats_available === ride.seats_total}
            onClick={() => run(() => adjustSeats(ride.id, 1), "Seat count updated")}
          >
            <Plus />
          </Button>
        </div>
      )}

      {cancelled ? (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run(() => updateRideStatus(ride.id, "open"), "Ride reactivated")}
        >
          <RotateCcw data-icon="inline-start" />
          Reactivate
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger render={<Button variant="outline" size="sm" disabled={pending} />}>
            <Ban data-icon="inline-start" />
            Cancel ride
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel this ride?</DialogTitle>
              <DialogDescription>
                It will be hidden from riders. You can reactivate it later from this page.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Keep ride</DialogClose>
              <DialogClose
                render={<Button variant="destructive" />}
                onClick={() => run(() => updateRideStatus(ride.id, "cancelled"), "Ride cancelled")}
              >
                Cancel ride
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog>
        <DialogTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Delete ride" disabled={pending} />}
        >
          <Trash2 />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this ride?</DialogTitle>
            <DialogDescription>This permanently removes the listing.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Keep ride</DialogClose>
            <DialogClose
              render={<Button variant="destructive" />}
              onClick={() => run(() => deleteRide(ride.id), "Ride deleted")}
            >
              Delete
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
