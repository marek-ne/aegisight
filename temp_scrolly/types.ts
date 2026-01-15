export enum StageId {
  Ingestion = 0,
  Fingerprint = 1,
  PhysicsGate = 2,
  Signature = 3,
  Output = 4,
}

export interface ContentBlock {
  id: StageId;
  title: string;
  subtitle: string;
  description: string;
  technicalDetail: string;
}

export const SCROLL_THRESHOLD = 0.5; // Trigger point on screen