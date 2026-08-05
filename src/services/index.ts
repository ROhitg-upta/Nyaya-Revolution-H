/**
 * Barrel for the services layer.
 *
 * Services encapsulate all communication with the outside world (REST APIs,
 * Supabase, third-party SDKs). Components and hooks call services — they never
 * talk to external systems directly.
 */
export * from "./http";
