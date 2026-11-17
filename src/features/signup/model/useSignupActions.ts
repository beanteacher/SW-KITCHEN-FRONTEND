"use client";

import { useMutation } from "@tanstack/react-query";
import { MemberApi } from "@/entities/member";
import { SignupApi } from "../api/signupApi";

export const useCheckUserId = () => useMutation({ mutationFn: MemberApi.checkUserId });
export const useSignup = () => useMutation({ mutationFn: SignupApi.signup });
export const useSocialSignup = () => useMutation({ mutationFn: SignupApi.socialSignup });
export const useSocialLink = () => useMutation({ mutationFn: SignupApi.socialLink });
