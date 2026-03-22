import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  useGetMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
  getGetMembersQueryKey,
  type Member
} from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency, toBengaliNumber } from "@/lib/utils";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ManageMembers() {
  const { isAdmin, isChecking } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", monthlyAmount: 100, isActive: true });

  useEffect(() => {
    if (!isChecking && !isAdmin) setLocation("/admin/login");
  }, [isAdmin, isChecking, setLocation]);

  const { data: members, isLoading } = useGetMembers();

  const createMutation = useCreateMember({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMembersQueryKey() });
        setIsDialogOpen(false);
        toast({ title: "সফল", description: "সদস্য সফলভাবে যোগ করা হয়েছে।" });
      }
    }
  });

  const updateMutation = useUpdateMember({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMembersQueryKey() });
        setIsDialogOpen(false);
        toast({ title: "সফল", description: "সদস্যের তথ্য আপডেট করা হয়েছে।" });
      }
    }
  });

  const deleteMutation = useDeleteMember({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMembersQueryKey() });
        toast({ title: "সফল", description: "সদস্য মুছে ফেলা হয়েছে।" });
      }
    }
  });

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ name: "", phone: "", address: "", monthlyAmount: 100, isActive: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: Member) => {
    setEditingId(member._id);
    setFormData({ name: member.name, phone: member.phone || "", address: member.address || "", monthlyAmount: member.monthlyAmount, isActive: member.isActive });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate({ data: formData });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("আপনি কি নিশ্চিত যে এই সদস্যকে মুছে ফেলতে চান?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isChecking || !isAdmin) return null;

  const filteredMembers = members?.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone && m.phone.includes(search))
  ) || [];

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">সদস্য পরিচালনা</h1>
          <p className="text-muted-foreground mt-1">মোট সদস্য: {toBengaliNumber(members?.length || 0)} জন</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input placeholder="খুঁজুন..." className="pl-12" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button onClick={openAddDialog} className="shrink-0 gap-2">
            <Plus className="w-5 h-5" /> নতুন সদস্য
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5 text-primary font-bold border-b border-border">
                  <th className="p-4">নাম</th>
                  <th className="p-4">মোবাইল</th>
                  <th className="p-4">ঠিকানা</th>
                  <th className="p-4">মাসিক চাঁদা</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold">{member.name}</td>
                    <td className="p-4 text-muted-foreground">{member.phone || '-'}</td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate">{member.address || '-'}</td>
                    <td className="p-4 font-bold text-primary">{formatCurrency(member.monthlyAmount)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(member)} className="w-10 h-10 p-0 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(member._id)} className="w-10 h-10 p-0 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">কোনো সদস্য পাওয়া যায়নি।</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "সদস্য এডিট করুন" : "নতুন সদস্য যোগ করুন"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-bold mb-2">নাম *</label>
              <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="সদস্যের নাম" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">মোবাইল নম্বর</label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="০১..." />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">ঠিকানা</label>
              <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="গ্রাম/মহল্লা" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">মাসিক চাঁদা (টাকা) *</label>
              <Input type="number" required min="0" value={formData.monthlyAmount} onChange={e => setFormData({ ...formData, monthlyAmount: Number(e.target.value) })} />
            </div>
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>বাতিল</Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
