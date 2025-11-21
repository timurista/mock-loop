"use client";

import { useForm } from "react-hook-form";
import { StartInterviewPayload } from "../lib/api";

interface Props {
  onSubmit: (data: StartInterviewPayload) => Promise<void>;
  disabled?: boolean;
}

const experienceOptions = ["Junior", "Mid", "Senior", "Staff"];
const companies = ["Amazon", "Google", "Meta", "Netflix", "Nextdoor"];

export function InterviewConfigurator({ onSubmit, disabled }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartInterviewPayload>({
    defaultValues: {
      candidate_name: "Avery Backend",
      target_company: companies[0],
      experience_level: "Senior",
      focus_area: "backend",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
      })}
      className="grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <h2 className="text-lg font-semibold text-slate-900">
          Spin up an interview room
        </h2>
        <p className="text-sm text-slate-500">
          MockLoop pairs a coding pad with an interviewer persona tailored to
          the company bar. Start with one coding prompt and a behavioral follow
          up.
        </p>
      </div>

      <label className="text-sm font-medium text-slate-700">
        Candidate alias
        <input
          type="text"
          {...register("candidate_name", { required: true })}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          disabled={disabled}
        />
        {errors.candidate_name ? (
          <span className="text-xs text-red-600">Name required</span>
        ) : null}
      </label>

      <label className="text-sm font-medium text-slate-700">
        Target company
        <select
          {...register("target_company", { required: true })}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          disabled={disabled}
        >
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        Experience band
        <select
          {...register("experience_level", { required: true })}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          disabled={disabled}
        >
          {experienceOptions.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        Focus area
        <select
          {...register("focus_area", { required: true })}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          disabled={disabled}
        >
          <option value="backend">Backend Systems</option>
          <option value="behavioral">Behavioral Loop</option>
          <option value="systems">Systems Design</option>
        </select>
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-wait"
        >
          {disabled ? "Spinning up room..." : "Start mock interview"}
        </button>
      </div>
    </form>
  );
}
