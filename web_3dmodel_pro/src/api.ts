import type { HighPolyAsset, ProCatalog } from './types';

async function parseJsonOrThrow<T>(resp: Response): Promise<T> {
  if (!resp.ok) {
    let detail = `HTTP ${resp.status}`;
    try {
      const err = await resp.json();
      if (err?.detail) {
        detail = typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail);
      }
    } catch {
      // ignore parse failure
    }
    throw new Error(detail);
  }
  return (await resp.json()) as T;
}

export async function fetchCatalog(): Promise<ProCatalog> {
  const r = await fetch('/api/pro/v1/catalog');
  return parseJsonOrThrow<ProCatalog>(r);
}

export async function fetchModels(): Promise<HighPolyAsset[]> {
  const r = await fetch('/api/pro/v1/models');
  const data = await parseJsonOrThrow<{ total: number; models: HighPolyAsset[] }>(r);
  return data.models || [];
}

export async function fetchModelDetail(modelId: string): Promise<HighPolyAsset> {
  const r = await fetch(`/api/pro/v1/models/${encodeURIComponent(modelId)}`);
  return parseJsonOrThrow<HighPolyAsset>(r);
}

export async function seedFlagshipModel(cyclesSamples = 20): Promise<HighPolyAsset> {
  const r = await fetch(`/api/pro/v1/models/seed-flagship?cycles_samples=${cyclesSamples}`, {
    method: 'POST',
  });
  return parseJsonOrThrow<HighPolyAsset>(r);
}

export async function forgeHighPolyCharacter(formData: FormData): Promise<HighPolyAsset> {
  const r = await fetch('/api/pro/v1/generate/character', {
    method: 'POST',
    body: formData,
  });
  return parseJsonOrThrow<HighPolyAsset>(r);
}

export async function upresToHighPoly(formData: FormData): Promise<HighPolyAsset> {
  const r = await fetch('/api/pro/v1/upres', {
    method: 'POST',
    body: formData,
  });
  return parseJsonOrThrow<HighPolyAsset>(r);
}

export async function deleteModel(modelId: string): Promise<void> {
  const r = await fetch(`/api/pro/v1/models/${encodeURIComponent(modelId)}`, {
    method: 'DELETE',
  });
  await parseJsonOrThrow(r);
}
