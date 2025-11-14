// import React, { useState, useEffect, useContext } from "react";
// import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService.js";
// import Select from "react-select";
// import { UserContext } from "../NewContextApis/UserContext.js";
// import { StudentContext , FileUploadContext} from "../NewContextApis/StudentContextApi.js";
// import {Row, Col, Table, Container, Button} from "react-bootstrap"
// import { updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";


// export const ImageUploadUtil = ({ _id, studentId }) => {
//  const effectiveId = _id || studentId;
//  const {fileUploadData, setFileUploadData} = useContext(FileUploadContext)

//  const [processing, setProcessing] = useState(false);
//  const [message, setMessage] = useState(null);
//  const [previews, setPreviews] = useState([]); // { url, fileName, sizeKB }
//  const TARGET_KB = 25;
//  const MAX_ORIGINAL_MB = 5;

//  // helper: read file as dataURL
//  const readFileAsDataURL = (file) =>
//    new Promise((res, rej) => {
//      const fr = new FileReader();
//      fr.onerror = () => { fr.abort(); rej(new Error("Problem reading file.")); };
//      fr.onload = () => res(fr.result);
//      fr.readAsDataURL(file);
//    });

//  // helper: create Image from dataURL
//  const loadImage = (dataURL) =>
//    new Promise((res, rej) => {
//      const img = new Image();
//      img.onload = () => res(img);
//      img.onerror = () => rej(new Error("Image load error"));
//      img.src = dataURL;
//    });

//  // fallback canvas compressor (same approach as before)
//  const compressImageWithCanvas = async (file, targetKB = TARGET_KB) => {
//    const mime = file.type || "image/jpeg";
//    const dataURL = await readFileAsDataURL(file);
//    const img = await loadImage(dataURL);

//    let width = img.width;
//    let height = img.height;

//    const canvas = document.createElement("canvas");
//    const ctx = canvas.getContext("2d");

//    const MAX_DIM = 2000;
//    if (width > MAX_DIM || height > MAX_DIM) {
//      const ratio = width / height;
//      if (ratio > 1) {
//        width = MAX_DIM;
//        height = Math.round(MAX_DIM / ratio);
//      } else {
//        height = MAX_DIM;
//        width = Math.round(MAX_DIM * ratio);
//      }
//    }

//    canvas.width = width;
//    canvas.height = height;
//    ctx.drawImage(img, 0, 0, width, height);

//    const targetBytes = targetKB * 1024;
//    const toBlob = (q) =>
//      new Promise((resolve) =>
//        canvas.toBlob((b) => resolve(b), mime, q)
//      );

//    let quality = 0.92;
//    let blob = null;

//    // try reducing quality
//    for (let i = 0; i < 6; i++) {
//      blob = await toBlob(quality);
//      if (!blob) break;
//      if (blob.size <= targetBytes) return new File([blob], file.name, { type: blob.type });
//      quality -= 0.15;
//      if (quality < 0.12) break;
//    }

//    // iterative downscale
//    let scale = 0.9;
//    while (true) {
//      width = Math.round(width * scale);
//      height = Math.round(height * scale);
//      if (width < 100 || height < 100) break;

//      canvas.width = width;
//      canvas.height = height;
//      ctx.clearRect(0, 0, width, height);
//      ctx.drawImage(img, 0, 0, width, height);

//      let q = Math.max(0.7, quality);
//      for (let j = 0; j < 6; j++) {
//        blob = await toBlob(q);
//        if (!blob) break;
//        if (blob.size <= targetBytes) return new File([blob], file.name, { type: blob.type });
//        q -= 0.12;
//        if (q < 0.12) break;
//      }

//      scale *= 0.85;
//      if (width < 200 || height < 200) {
//        blob = await toBlob(0.08);
//        if (blob && blob.size <= targetBytes) return new File([blob], file.name, { type: blob.type });
//        break;
//      }
//    }

//    if (blob) return new File([blob], file.name, { type: blob.type });
//    return file;
//  };

//  // attempt library compression (browser-image-compression) then fallback to canvas if needed
//  const compressImage = async (file, targetKB = TARGET_KB) => {
//    try {
//      // dynamic import so we don't have to change top-level imports
//      const imglib = await import("browser-image-compression");
//      const imageCompression = imglib && (imglib.default || imglib);

//      if (!imageCompression) throw new Error("browser-image-compression import failed");

//      // convert targetKB to MB for library option
//      const targetMB = targetKB / 1024;

//      // library options: try to reach targetMB, but library may not perfectly hit target
//      const options = {
//        maxSizeMB: Math.max(0.01, targetMB), // minimum guard
//        maxWidthOrHeight: 1200,
//        useWebWorker: true,
//        initialQuality: 0.8,
//        fileType: file.type || "image/jpeg",
//      };

//      // try library compression
//      const compressedBlob = await imageCompression(file, options);

//      // if library returned blob and it's <= target, use it
//      if (compressedBlob && compressedBlob.size <= targetKB * 1024) {
//        return new File([compressedBlob], file.name, { type: compressedBlob.type });
//      }

//      // if library produced a smaller file (even if > target), accept it as candidate
//      if (compressedBlob && compressedBlob.size < file.size) {
//        // but if still larger than target, try canvas fallback to try to get smaller
//        const candidate = new File([compressedBlob], file.name, { type: compressedBlob.type });
//        // attempt canvas fallback starting from candidate if needed
//        const canvasResult = await compressImageWithCanvas(candidate, targetKB);
//        if (canvasResult && canvasResult.size <= targetKB * 1024) return canvasResult;
//        // else if canvas didn't help, return candidate (still smaller than original)
//        return candidate;
//      }

//      // if library didn't help, fallback to canvas with original file
//      return await compressImageWithCanvas(file, targetKB);
//    } catch (err) {
//      // if library not available or fails, fallback to canvas
//      console.warn("Image compression library not available or failed — falling back to canvas method.", err);
//      return await compressImageWithCanvas(file, targetKB);
//    }
//  };

//  const handleFiles = async (e) => {
//    const files = Array.from(e.target.files || []);
//    if (!files.length) return;

//    setMessage(null);
//    setProcessing(true);

//    // validate types: must be images
//    const invalidType = files.filter((f) => !f.type || !f.type.startsWith("image/"));
//    if (invalidType.length > 0) {
//      alert("Only image files are allowed. Non-image file detected and upload cancelled.");
//      setProcessing(false);
//      e.target.value = "";
//      return;
//    }

//    // validate original size < 5 MB
//    const tooLarge = files.filter((f) => f.size > MAX_ORIGINAL_MB * 1024 * 1024);
//    if (tooLarge.length > 0) {
//      alert(`Each file must be smaller than ${MAX_ORIGINAL_MB} MB. Upload cancelled.`);
//      setProcessing(false);
//      e.target.value = "";
//      return;
//    }

//    try {
//      const compressedList = [];
//      for (const f of files) {
//        const compressed = await compressImage(f, TARGET_KB);
//        compressedList.push({ fileName: f.name, file: compressed });
//      }

//      if (typeof setFileUploadData === "function") {
//        setFileUploadData(compressedList);
//      } else {
//        console.warn("setFileUploadData not available in FileUploadContext");
//      }

//      console.log("FileUploadContext value saved:", compressedList);

//      // build previews and revoke any previous URLs
//      setPreviews((prev) => {
//        // revoke old urls
//        if (Array.isArray(prev)) {
//          prev.forEach(p => { try { URL.revokeObjectURL(p.url); } catch (e) {} });
//        }
//        const newPreviews = compressedList.map(item => ({
//          url: item.file ? URL.createObjectURL(item.file) : null,
//          fileName: item.fileName,
//          sizeKB: item.file && item.file.size ? Math.round(item.file.size / 1024) : "-"
//        }));
//        return newPreviews;
//      });

//      setMessage(`Uploaded ${compressedList.length} image(s).`);
//    } catch (err) {
//      console.error("Error compressing/uploading images:", err);
//      setMessage("There was an error processing the image(s). Check console for details.");
//      alert("Error processing images. See console for details.");
//    } finally {
//      setProcessing(false);
//      e.target.value = "";
//    }
//  };

//  // NEW: submit handler to call updateStudent when _id provided
//  const handleSubmit = async () => {
//    if (!effectiveId) {
//      setMessage("No _id provided — cannot update.");
//      return;
//    }

//    if (!fileUploadData || fileUploadData.length === 0) {
//      setMessage("No images to upload. Please select at least one image.");
//      return;
//    }

//    setProcessing(true);
//    setMessage(null);

//    try {
//      const formData = new FormData();
//      formData.append("_id", effectiveId);
//      // append all files (backend should accept array under 'images' or similar)
//      fileUploadData.forEach((item, idx) => {
//        if (item && item.file) {
//          // use name 'images' to allow multiple files; adjust if backend expects a different key
//          formData.append("images", item.file, item.fileName || `image_${idx}`);
//        }
//      });

//      const resp = await updateStudent(formData);
//      console.log("updateStudent response:", resp);
//      setMessage("Image(s) updated successfully.");
//    } catch (err) {
//      console.error("Error updating student images:", err);
//      setMessage("Failed to update image(s). See console for details.");
//      alert("Failed to update images. See console for details.");
//    } finally {
//      setProcessing(false);
//    }
//  };

//  // cleanup object URLs on unmount
//  useEffect(() => {
//    return () => {
//      previews.forEach(p => { try { URL.revokeObjectURL(p.url); } catch (e) {} });
//    };
//  }, [previews]);

//  return (
//      <Container>
//        <Row style={{ marginTop: 12 }}>
//          <Col>
//            <label htmlFor="file-input" style={{ fontWeight: 600 }}>
//              Upload your passport size image — file must be &lt; {MAX_ORIGINAL_MB} MB (अपनी पासपोर्ट साइज की फोटो अपलोड करें — फ़ाइल 5 MB से कम होनी चाहिए।)
//            </label>
//            <small>
//             Note: You can register without a passport photo, but please upload it within 2 to 3 days.
// नोट: आप बिना पासपोर्ट फोटो के भी रजिस्टर कर सकते हैं, लेकिन कृपया 48 घंटे के भीतर इसे अपलोड कर दें।
//            </small>
//            <br />
//            <input
//              id="file-input"
//              type="file"
//              accept="image/*"
//              multiple
//              onChange={handleFiles}
//              disabled={processing}
//            />
//            {processing && <div style={{ marginTop: 8 }}>Processing images... please wait.</div>}
//            {message && <div style={{ marginTop: 8 }}>{message}</div>}

//            {/* NEW: Inline previews directly below input */}
//            {previews && previews.length > 0 && (
//              <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
//                {previews.map((p, idx) => (
//                  <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                    {p.url ? (
//                      <img
//                        src={p.url}
//                        alt={p.fileName}
//                        style={{ width: 80, height: "auto", objectFit: "cover", borderRadius: 4 }}
//                        onLoad={() => {
//                          // optionally revoke after load if you don't need persistent preview (commented out to keep preview visible)
//                          // URL.revokeObjectURL(p.url);
//                        }}
//                      />
//                    ) : null}
//                    <div style={{ fontSize: 14 }}>
//                      <div style={{ fontWeight: 600 }}>{p.fileName}</div>
//                      <div style={{ color: "#333" }}>({p.sizeKB} KB)</div>
//                    </div>
//                  </div>
//                ))}
//              </div>
//            )}

//            {/* Submit button to call updateStudent when _id provided */}
//            <div style={{ marginTop: 12 }}>
//              <Button
//                onClick={handleSubmit}
//                disabled={processing || !fileUploadData || fileUploadData.length === 0 || !effectiveId}
//              >
//                {effectiveId ? "Update Image" : "No _id (cannot update)"}
//              </Button>
//            </div>
//          </Col>
//        </Row>
//      </Container>
//  );
// }














import React, { useState, useEffect, useContext, useRef } from "react";
import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService.js";
import Select from "react-select";
import { UserContext } from "../NewContextApis/UserContext.js";
import { StudentContext, FileUploadContext } from "../NewContextApis/StudentContextApi.js";
import { Row, Col, Table, Container, Button, Spinner } from "react-bootstrap";
import { updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";

/**
 * ImageUploadUtil
 *
 * - Immediately compresses and uploads the first selected image under field name "image".
 * - Shows a compact upload box with preview and loader overlay.
 * - Accepts either prop `_id` or `studentId` (effectiveId = _id || studentId).
 */
export const ImageUploadUtil = ({ _id, studentId }) => {
  const effectiveId = _id || studentId;
  const { fileUploadData, setFileUploadData } = useContext(FileUploadContext);

  const [processing, setProcessing] = useState(false); // for compression + upload
  const [message, setMessage] = useState(null); // status text
  const [preview, setPreview] = useState(null); // { url, fileName, sizeKB }
  const TARGET_KB = 25;
  const MAX_ORIGINAL_MB = 5;
  const inputRef = useRef(null);

  // helpers (same behavior as before)
  const readFileAsDataURL = (file) =>
    new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onerror = () => {
        fr.abort();
        rej(new Error("Problem reading file."));
      };
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(file);
    });

  const loadImage = (dataURL) =>
    new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error("Image load error"));
      img.src = dataURL;
    });

  const compressImageWithCanvas = async (file, targetKB = TARGET_KB) => {
    const mime = file.type || "image/jpeg";
    const dataURL = await readFileAsDataURL(file);
    const img = await loadImage(dataURL);

    let width = img.width;
    let height = img.height;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const MAX_DIM = 2000;
    if (width > MAX_DIM || height > MAX_DIM) {
      const ratio = width / height;
      if (ratio > 1) {
        width = MAX_DIM;
        height = Math.round(MAX_DIM / ratio);
      } else {
        height = MAX_DIM;
        width = Math.round(MAX_DIM * ratio);
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const targetBytes = targetKB * 1024;
    const toBlob = (q) =>
      new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, q));

    let quality = 0.92;
    let blob = null;

    for (let i = 0; i < 6; i++) {
      blob = await toBlob(quality);
      if (!blob) break;
      if (blob.size <= targetBytes) return new File([blob], file.name, { type: blob.type });
      quality -= 0.15;
      if (quality < 0.12) break;
    }

    let scale = 0.9;
    while (true) {
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      if (width < 100 || height < 100) break;

      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      let q = Math.max(0.7, quality);
      for (let j = 0; j < 6; j++) {
        blob = await toBlob(q);
        if (!blob) break;
        if (blob.size <= targetBytes) return new File([blob], file.name, { type: blob.type });
        q -= 0.12;
        if (q < 0.12) break;
      }

      scale *= 0.85;
      if (width < 200 || height < 200) {
        blob = await toBlob(0.08);
        if (blob && blob.size <= targetBytes) return new File([blob], file.name, { type: blob.type });
        break;
      }
    }

    if (blob) return new File([blob], file.name, { type: blob.type });
    return file;
  };

  const compressImage = async (file, targetKB = TARGET_KB) => {
    try {
      const imglib = await import("browser-image-compression");
      const imageCompression = imglib && (imglib.default || imglib);

      if (!imageCompression) throw new Error("browser-image-compression import failed");

      const targetMB = targetKB / 1024;
      const options = {
        maxSizeMB: Math.max(0.01, targetMB),
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: file.type || "image/jpeg",
      };

      const compressedBlob = await imageCompression(file, options);

      if (compressedBlob && compressedBlob.size <= targetKB * 1024) {
        return new File([compressedBlob], file.name, { type: compressedBlob.type });
      }

      if (compressedBlob && compressedBlob.size < file.size) {
        const candidate = new File([compressedBlob], file.name, { type: compressedBlob.type });
        const canvasResult = await compressImageWithCanvas(candidate, targetKB);
        if (canvasResult && canvasResult.size <= targetKB * 1024) return canvasResult;
        return candidate;
      }

      return await compressImageWithCanvas(file, targetKB);
    } catch (err) {
      console.warn("Image compression library failed — falling back to canvas method.", err);
      return await compressImageWithCanvas(file, targetKB);
    }
  };

  // upload single compressed file immediately
  const uploadCompressedFile = async (fileObj) => {
    if (!effectiveId) {
      setMessage("No student id available");
      return;
    }
    setProcessing(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("_id", effectiveId);
      formData.append("image", fileObj, fileObj.name || "image.jpg");

      // call service (make sure service doesn't set Content-Type manually)
      const resp = await updateStudent(formData);
      console.log("updateStudent response:", resp);
      setMessage("Uploaded");
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Upload failed");
      alert("Upload failed. See console for details.");
    } finally {
      setProcessing(false);
      // clear file input so same file can be chosen again if needed
      try {
        if (inputRef.current) inputRef.current.value = "";
      } catch (e) {}
    }
  };

  // handle file input change: compress first file and upload it
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setMessage(null);
    setProcessing(true);

    const first = files[0];

    // basic validation
    if (!first.type || !first.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      setProcessing(false);
      e.target.value = "";
      return;
    }
    if (first.size > MAX_ORIGINAL_MB * 1024 * 1024) {
      alert(`File must be smaller than ${MAX_ORIGINAL_MB} MB.`);
      setProcessing(false);
      e.target.value = "";
      return;
    }

    try {
      const compressed = await compressImage(first, TARGET_KB);
      // save to FileUploadContext if provided
      const compressedList = [{ fileName: compressed.name || first.name, file: compressed }];
      if (typeof setFileUploadData === "function") setFileUploadData(compressedList);

      // build preview
      const url = compressed ? URL.createObjectURL(compressed) : null;
      setPreview({
        url,
        fileName: compressed.name || first.name,
        sizeKB: compressed && compressed.size ? Math.round(compressed.size / 1024) : "-",
      });

      // immediately upload compressed file (single)
      await uploadCompressedFile(compressed);
    } catch (err) {
      console.error("Error processing file:", err);
      setMessage("Error processing image");
      alert("Error processing image. See console for details.");
      try {
        if (inputRef.current) inputRef.current.value = "";
      } catch (e) {}
    } finally {
      setProcessing(false);
    }
  };

  // cleanup object URL on unmount / when preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.url) {
        try {
          URL.revokeObjectURL(preview.url);
        } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview?.url]);

  // Small accessible label for hidden file input
  const openFilePicker = () => {
    if (processing) return;
    try {
      inputRef.current && inputRef.current.click();
    } catch (e) {}
  };

  // Render upload box – compact, visually obvious in table cell
  return (
    <div
      style={{
        width: 120,
        minHeight: 120,
        borderRadius: 8,
        border: "1px dashed #b9c6d9",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "#fff",
        cursor: processing ? "not-allowed" : "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      onClick={openFilePicker}
      title={effectiveId ? "Click to choose image and upload" : "No student id available"}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        id={`image-upload-${effectiveId || "noid"}`}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFiles}
        disabled={processing || !effectiveId}
      />

      {/* Preview or placeholder */}
      {preview?.url ? (
        <img
          src={preview.url}
          alt={preview.fileName}
          style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }}
        />
      ) : (
        <div style={{ textAlign: "center", padding: 6 }}>
          <div style={{ fontWeight: 700, color: "#2f6f9f", fontSize: 12 }}>Upload</div>
          <div style={{ fontSize: 11, color: "#4b5563", marginTop: 6, maxWidth: 100 }}>
            passport size image — file &lt; {MAX_ORIGINAL_MB} MB
          </div>
        </div>
      )}

      {/* status text */}
      <div style={{ marginTop: 8, fontSize: 12, color: message === "Uploaded" ? "green" : "#444" }}>
        {processing ? "Uploading..." : message ? message : effectiveId ? "Click to choose" : "No ID"}
      </div>

      {/* loader overlay */}
      {processing && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            pointerEvents: "none",
          }}
        >
          <Spinner animation="border" size="sm" />
        </div>
      )}
    </div>
  );
};
