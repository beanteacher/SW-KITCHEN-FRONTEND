"use client";

import { useMutation } from "@tanstack/react-query";
import { PasswordChangeApi } from "../api/passwordChangeApi";

export const useChangePassword = () => useMutation({ mutationFn: PasswordChangeApi.change });
