import { StageId, ContentBlock } from './types';

export const STORY_CONTENT: ContentBlock[] = [
  {
    id: StageId.Ingestion,
    title: "INGESTION",
    subtitle: "The Universal Forensic Pipeline",
    description: "Seamless unification of your enterprise ecosystem. We harmonize fragmented data streams into a single, conflict-free timeline, guaranteeing that every global event is perfectly sequenced for analysis.",
    technicalDetail: "Input: Agnostic Data Streams | Sync: Absolute Temporal Integrity"
  },
  {
    id: StageId.Fingerprint,
    title: "AI FINGERPRINT",
    subtitle: "Synthesizing Multi-Domain Tensors",
    description: "Isolates latent patterns within complex data streams, identifying the probabilistic precursors of risk before they impact operations.",
    technicalDetail: "Status: Silent Drift Detected | Metric: Similarity > 0.75"
  },
  {
    id: StageId.PhysicsGate,
    title: "DETERMINISTIC VALIDATION",
    subtitle: "The Symbolic Logic Gate",
    description: "Transforms probabilistic warnings into deterministic facts. We apply a 'Hard Logic' verification layer, ensuring that only verified patterns—never false positives—are promoted to a Signature.",
    technicalDetail: "Threshold: Confidence > 85% | Method: Deterministic Hardening"
  },
  {
    id: StageId.Signature,
    title: "XAI ANALYSIS",
    subtitle: "The Verified Signature",
    description: "The definitive, non-repudiable output. Using Explainable AI (XAI), we generate a forensic 'Digital Death Certificate' that codifies the Root Cause, Blast Radius, and Time-to-Failure with absolute mathematical certainty.",
    technicalDetail: "Output: Digital Death Certificate | Certainty: Absolute"
  },
  {
    id: StageId.Output,
    title: "ENTERPRISE INTEGRATION",
    subtitle: "Adaptive Integration",
    description: "Delivers forensic certainty directly to your command center. We route the 'Digital Death Certificate' to your existing workflows, enabling precise, human-validated decision making without disrupting operational continuity.",
    technicalDetail: "Output: Universal API Schema | Control: Human-in-the-Loop Governance"
  }
];