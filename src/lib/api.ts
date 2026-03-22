import { useQuery, useMutation } from "@tanstack/react-query";

export interface Member {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
  monthlyAmount: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Donation {
  _id: string;
  memberId: string;
  memberName?: string;
  amount: number;
  month: string;
  year: string;
  note?: string;
  paidAt: string;
}

export interface Summary {
  totalMembers: number;
  totalCollected: number;
  totalDue: number;
  paidCount: number;
  unpaidCount: number;
  month: string;
  year: string;
}

async function apiFetch(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

async function apiMutate(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export function getGetMembersQueryKey() {
  return ["members"];
}
export function getGetDonationsQueryKey() {
  return ["donations"];
}
export function getGetSummaryQueryKey() {
  return ["summary"];
}

export function useGetMembers() {
  return useQuery<Member[]>({ queryKey: getGetMembersQueryKey(), queryFn: () => apiFetch("/api/members") });
}

export function useGetDonations(params?: { month?: string; year?: string; memberId?: string }) {
  const q = new URLSearchParams();
  if (params?.month) q.set("month", params.month);
  if (params?.year) q.set("year", params.year);
  if (params?.memberId) q.set("memberId", params.memberId);
  return useQuery<Donation[]>({
    queryKey: ["donations", params],
    queryFn: () => apiFetch(`/api/donations?${q}`),
  });
}

export function useGetSummary(params?: { month?: string; year?: string }) {
  const q = new URLSearchParams();
  if (params?.month) q.set("month", params.month);
  if (params?.year) q.set("year", params.year);
  return useQuery<Summary>({
    queryKey: ["summary", params],
    queryFn: () => apiFetch(`/api/summary?${q}`),
  });
}

export function useCreateMember(options?: { mutation?: { onSuccess?: () => void } }) {
  return useMutation({
    mutationFn: ({ data }: { data: Partial<Member> }) => apiMutate("/api/members", "POST", data),
    onSuccess: options?.mutation?.onSuccess,
  });
}

export function useUpdateMember(options?: { mutation?: { onSuccess?: () => void } }) {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Member> }) =>
      apiMutate(`/api/members/${id}`, "PUT", data),
    onSuccess: options?.mutation?.onSuccess,
  });
}

export function useDeleteMember(options?: { mutation?: { onSuccess?: () => void } }) {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => apiMutate(`/api/members/${id}`, "DELETE"),
    onSuccess: options?.mutation?.onSuccess,
  });
}

export function useCreateDonation(options?: { mutation?: { onSuccess?: () => void } }) {
  return useMutation({
    mutationFn: ({ data }: { data: Partial<Donation> }) => apiMutate("/api/donations", "POST", data),
    onSuccess: options?.mutation?.onSuccess,
  });
}

export function useDeleteDonation(options?: { mutation?: { onSuccess?: () => void } }) {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => apiMutate(`/api/donations/${id}`, "DELETE"),
    onSuccess: options?.mutation?.onSuccess,
  });
}
