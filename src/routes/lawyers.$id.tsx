import { createFileRoute, Link } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Star, Clock, Briefcase, CalendarIcon, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lawyers/$id")({
  component: LawyerProfilePage,
});

function LawyerProfilePage() {
  return (
    <AppLayout>
      <LawyerProfileContent />
    </AppLayout>
  );
}

function LawyerProfileContent() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [lawyer, setLawyer] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [booking, setBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("lawyers").select("*").eq("id", id).single(),
      supabase.from("lawyer_availability").select("*").eq("lawyer_id", id),
    ]).then(([{ data: l }, { data: a }]) => {
      setLawyer(l);
      setAvailability(a ?? []);
      setLoading(false);
    });
  }, [id]);

  const availableSlots = selectedDate
    ? availability.find((a) => a.day_of_week === selectedDate.getDay())?.time_slots ?? []
    : [];

  const handleBook = async () => {
    if (!user || !selectedDate || !selectedSlot) return;
    setBooking(true);
    const { error } = await supabase.from("consultations").insert({
      user_id: user.id,
      lawyer_id: id,
      consultation_date: selectedDate.toISOString().split("T")[0],
      time_slot: selectedSlot,
    });
    if (error) toast.error("Booking failed: " + error.message);
    else {
      toast.success("Consultation booked successfully!");
      setDialogOpen(false);
      setSelectedDate(undefined);
      setSelectedSlot("");
    }
    setBooking(false);
  };

  if (loading) return <div className="animate-pulse text-muted-foreground p-8">Loading…</div>;
  if (!lawyer) return <div className="p-8">Lawyer not found. <Link to="/lawyers" className="text-primary">Back to listings</Link></div>;

  const availableDays = availability.map((a) => a.day_of_week);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link to="/lawyers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Lawyers
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
              {lawyer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{lawyer.name}</h1>
                <Badge variant={lawyer.is_available ? "default" : "secondary"}>
                  {lawyer.is_available ? "Available" : "Offline"}
                </Badge>
              </div>
              <p className="text-primary capitalize font-medium mt-1">{lawyer.specialization} Law</p>
              <div className="flex items-center gap-5 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {lawyer.experience_years} years</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-warning" /> {lawyer.rating}/5</span>
                {lawyer.consultation_fee && <span className="font-medium text-foreground">₹{lawyer.consultation_fee}/session</span>}
              </div>
            </div>
          </div>
          {lawyer.bio && <p className="mt-5 text-muted-foreground leading-relaxed">{lawyer.bio}</p>}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!lawyer.is_available}>
              <CalendarIcon className="h-4 w-4" /> Book Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Consultation with {lawyer.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Select Date</p>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setSelectedSlot(""); }}
                  disabled={(date) => {
                    const day = date.getDay();
                    return !availableDays.includes(day) || date < new Date();
                  }}
                  className={cn("rounded-md border pointer-events-auto")}
                />
              </div>
              {selectedDate && availableSlots.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Select Time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot: string) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {selectedDate && availableSlots.length === 0 && (
                <p className="text-sm text-muted-foreground">No slots available for this day.</p>
              )}
              <Button onClick={handleBook} disabled={!selectedDate || !selectedSlot || booking} className="w-full">
                {booking ? "Booking…" : "Confirm Booking"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
