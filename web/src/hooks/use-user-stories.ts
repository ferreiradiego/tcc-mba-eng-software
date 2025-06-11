import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Trimester {
  id: string;
  year: number;
  number: number;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  trimesterId: string;
  trimester?: Trimester;
}

export interface UserStory {
  id: string;
  title: string;
  status: string;
  description?: string;
  activationDate?: string;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sprintId?: string;
  sprint?: Sprint;
}

export interface UserStoryForm {
  title: string;
  status: string;
  description?: string;
  activationDate?: string;
  blocked?: boolean;
  sprintId?: string;
}

export function useUserStories() {
  const queryClient = useQueryClient();

  const {
    data: userStories = [],
    isLoading: loading,
    error,
  } = useQuery<UserStory[], Error>({
    queryKey: ["user-stories"],
    queryFn: async () => {
      const res = await api.get("/scrum/user-stories");
      return res.data;
    },
  });

  const createUserStory = useMutation({
    mutationFn: async (data: UserStoryForm) => {
      const res = await api.post("/scrum/user-stories", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stories"] });
    },
  });

  const updateUserStory = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UserStoryForm>;
    }) => {
      const res = await api.put(`/scrum/user-stories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stories"] });
    },
  });

  const deleteUserStory = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scrum/user-stories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stories"] });
    },
  });

  return {
    userStories,
    loading,
    error,
    createUserStory,
    updateUserStory,
    deleteUserStory,
  };
}
