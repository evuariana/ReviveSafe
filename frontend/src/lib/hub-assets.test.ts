import test from "node:test";
import assert from "node:assert/strict";

import {
  buildHubAssetMetadataPrefix,
  decodeAssetIdFromMetadataStorageKey,
} from "./hub-assets.ts";

test("buildHubAssetMetadataPrefix returns the Assets.Metadata storage prefix", () => {
  assert.equal(
    buildHubAssetMetadataPrefix(),
    "0x682a59d51ab9e48a8c8cc418ff9708d2b5f3822e35ca2f31ce3526eab1363fd2"
  );
});

test("decodeAssetIdFromMetadataStorageKey reads the SCALE-encoded asset id from a metadata key", () => {
  assert.equal(
    decodeAssetIdFromMetadataStorageKey(
      "0x682a59d51ab9e48a8c8cc418ff9708d2b5f3822e35ca2f31ce3526eab1363fd2d82c12285b5d4551f88e8f6e7eb52b8101000000"
    ),
    1
  );
  assert.equal(
    decodeAssetIdFromMetadataStorageKey(
      "0x682a59d51ab9e48a8c8cc418ff9708d2b5f3822e35ca2f31ce3526eab1363fd2a319d0e87221ca1ee751c1529f201522c0070000"
    ),
    1984
  );
});

test("decodeAssetIdFromMetadataStorageKey rejects unrelated storage keys", () => {
  assert.equal(
    decodeAssetIdFromMetadataStorageKey(
      "0x1111111111111111111111111111111111111111111111111111111111111111"
    ),
    null
  );
});
