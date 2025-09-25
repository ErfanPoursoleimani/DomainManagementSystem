export interface Domain {
  id: string;
  domain: string;
  status: 1 | 2 | 3;
  isActive: boolean;
  createdDate: string;
}

export interface DomainFilters {
  search: string,
  activeState: "Active" | "Inactive" | "all",
  status: "Verified" | "Pending" | "Rejected" | "all"
}