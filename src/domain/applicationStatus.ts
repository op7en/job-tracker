export const APPLICATION_STATUSES = [
  "applied",
  "interview",
  "rejected",
  "offer",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const isApplicationStatus = (
  value: string,
): value is ApplicationStatus => {
  return APPLICATION_STATUSES.includes(value as ApplicationStatus);
};
