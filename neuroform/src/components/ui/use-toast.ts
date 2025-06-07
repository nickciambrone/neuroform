import { toast as defaultToast } from "sonner";

export function useToast() {
  return {
    toast: defaultToast
  };
}
