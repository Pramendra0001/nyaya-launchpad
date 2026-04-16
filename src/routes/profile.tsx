import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Mail, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppLayout>
      <ProfileContent />
    </AppLayout>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("name").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setName(data.name);
    });
    supabase.from("user_roles").select("role").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setRole(data.role);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name }).eq("user_id", user.id);
    if (error) toast.error("Failed to update profile");
    else toast.success("Profile updated!");
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Personal Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Shield className="h-4 w-4" /> Role</Label>
            <Input value={role} disabled className="capitalize" />
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
