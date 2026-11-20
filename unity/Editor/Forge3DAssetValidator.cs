#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

namespace Forge3D.UnityEditor
{
    public static class Forge3DAssetValidator
    {
        [MenuItem("Forge3D/Validate Unity_Export Assets")]
        public static void ValidateAllImportedAssets()
        {
            string[] guids = AssetDatabase.FindAssets("t:Model", new[] { "Assets/Unity_Export" });
            int passed = 0;
            int failed = 0;

            foreach (string guid in guids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                var importer = AssetImporter.GetAtPath(path) as ModelImporter;
                if (importer == null) continue;

                bool ok = true;
                if (Mathf.Abs(importer.globalScale - 1.0f) > 0.001f)
                {
                    Debug.LogWarning($"[Forge3D] Scale mismatch on {path}: {importer.globalScale}");
                    ok = false;
                }

                GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
                if (prefab == null)
                {
                    Debug.LogError($"[Forge3D] Failed to load model prefab: {path}");
                    failed++;
                    continue;
                }

                var renderers = prefab.GetComponentsInChildren<MeshRenderer>();
                if (renderers.Length == 0)
                {
                    Debug.LogWarning($"[Forge3D] No MeshRenderer found on {path}");
                }

                if (ok) passed++; else failed++;
            }

            Debug.Log($"[Forge3D] Unity 6 Validation Complete: {passed} passed, {failed} failed.");
        }
    }
}
#endif
