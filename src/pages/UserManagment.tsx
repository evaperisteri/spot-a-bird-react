import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  UserFilterValues,
  UserFilters,
  UserReadOnlyDTO,
} from "../types/userTypes";
import {
  PlusCircle,
  Trash,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { authFetch } from "../api/client";

interface PaginatedUserResponse {
  data: UserReadOnlyDTO[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  currentPage: number;
  pageSize: number;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserReadOnlyDTO[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilterValues>({
    username: "",
    email: "",
    role: "",
    isActive: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const apiFilters: UserFilters = {
        username: filters.username || undefined,
        email: filters.email || undefined,
        role: filters.role || undefined,
        isActive: filters.isActive ? filters.isActive === "true" : undefined,
        page: page,
        pageSize: rowsPerPage,
      };

      console.log("Sending filters:", apiFilters);

      const response = await authFetch("/api/users/filtered/paginated", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFilters),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch users: ${response.status} ${errorText}`
        );
      }

      const data: PaginatedUserResponse = await response.json();
      console.log("Received data:", data);

      setUsers(data.data);
      setTotalUsers(data.totalElements);
    } catch (err) {
      toast.error("Failed to fetch users", {
        description: "Please try again later.",
      });
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (user: UserReadOnlyDTO) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Try to get detailed error message
        let errorDetail = `HTTP error! status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorDetail =
            errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          // If no JSON response, use status text
          errorDetail = response.statusText || errorDetail;
        }

        throw new Error(errorDetail);
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err: unknown) {
      console.error("Delete error details:", err);
      toast.error(
        err instanceof Error
          ? "You can not delete a user with saved logs. Try deactivation! " +
              err.message
          : "You can not delete a user with saved logs. Try deactivation!"
      );
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      username: "",
      email: "",
      role: "",
      isActive: "",
    });
    toast.info("Filters cleared");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl text-purple font-logo">User Management</h2>
        <Button
          className="bg-purple/80 hover:bg-purple text-offwhite shadow-soft flex items-center gap-2"
          onClick={() => navigate("/users/register")}
        >
          <PlusCircle size={18} />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-offwhite/90 rounded-xl shadow-soft p-6 mb-8 border-2 border-lilac/50">
        <h3 className="text-xl text-purple font-logo mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="filter-username" className="text-purple font-sans">
              Username
            </Label>
            <Input
              id="filter-username"
              type="text"
              name="username"
              value={filters.username}
              onChange={handleFilterChange}
              placeholder="Search username..."
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
            />
          </div>
          <div>
            <Label htmlFor="filter-email" className="text-purple font-sans">
              Email
            </Label>
            <Input
              id="filter-email"
              type="text"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Search email..."
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
            />
          </div>
          <div>
            <Label htmlFor="filter-role" className="text-purple font-sans">
              Role
            </Label>
            <select
              id="filter-role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple bg-offwhite font-sans"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="SPOTTER">Spotter</option>
            </select>
          </div>
          <div>
            <Label htmlFor="filter-status" className="text-purple font-sans">
              Status
            </Label>
            <select
              id="filter-status"
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple bg-offwhite font-sans"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <Button
          onClick={clearFilters}
          variant="outline"
          className="text-purple hover:bg-lilac/20 border-lilac"
        >
          Clear Filters
        </Button>
      </div>

      {/* Users Table - Responsive */}
      <div className="bg-offwhite/90 rounded-xl shadow-soft overflow-hidden border-2 border-lilac/50">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-lilac/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-purple font-logo">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-purple font-logo">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-purple font-logo">
                      First Name
                    </th>
                    <th className="px-6 py-3 text-left text-purple font-logo">
                      Last Name
                    </th>
                    <th className="px-6 py-3 text-left text-purple font-logo">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-purple font-logo">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-purple font-logo">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lilac/20">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-lilac/10 transition-colors"
                    >
                      <td className="px-6 py-4 text-purple font-sans">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-purple font-sans">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-purple font-sans">
                        {user.firstname}
                      </td>
                      <td className="px-6 py-4 text-purple font-sans">
                        {user.lastname}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-sans ${
                            user.role === "ADMIN"
                              ? "bg-purple/20 text-purple"
                              : user.role === "SPOTTER"
                              ? "bg-sage/20 text-sage"
                              : "bg-lilac/20 text-lilac"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-sans ${
                              user.isActive
                                ? "bg-sage/20 text-sage"
                                : "bg-purple/20 text-purple"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple hover:bg-purple/20"
                            onClick={() => handleEdit(user)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple hover:bg-purple/20"
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (shown on mobile) */}
            <div className="md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border-b border-lilac/20 hover:bg-lilac/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-purple font-semibold font-sans">
                        {user.username}
                      </h3>
                      <p className="text-purple/70 text-sm font-sans">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple hover:bg-purple/20 p-1 h-8 w-8"
                        onClick={() => handleEdit(user)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple hover:bg-purple/20 p-1 h-8 w-8"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-purple/60 font-sans">
                        First Name
                      </p>
                      <p className="text-purple font-sans">{user.firstname}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple/60 font-sans">
                        Last Name
                      </p>
                      <p className="text-purple font-sans">{user.lastname}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-sans ${
                        user.role === "ADMIN"
                          ? "bg-purple/20 text-purple"
                          : user.role === "SPOTTER"
                          ? "bg-sage/20 text-sage"
                          : "bg-lilac/20 text-lilac"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-sans ${
                        user.isActive
                          ? "bg-sage/20 text-sage"
                          : "bg-lilac/20 text-purple"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 md:px-6 py-4 border-t border-lilac/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <span className="text-sm text-purple/70 font-sans mr-2">
                  Rows per page:
                </span>
                <select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  className="border border-lilac rounded-md px-2 py-1 text-sm text-purple bg-offwhite"
                >
                  <option value={5}>5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>

              <div className="text-sm text-purple/70 font-sans">
                {`${page * rowsPerPage + 1}-${Math.min(
                  (page + 1) * rowsPerPage,
                  totalUsers
                )} of ${totalUsers}`}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-lilac text-purple hover:bg-lilac/20 flex items-center"
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-lilac text-purple hover:bg-lilac/20 flex items-center"
                  onClick={() => handleChangePage(page + 1)}
                  disabled={(page + 1) * rowsPerPage >= totalUsers}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
