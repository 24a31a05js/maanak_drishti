import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  FileImage,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../services/ocrService';

export default function ConsumerScanner({ onScanComplete, isProcessing = false }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [showSamplesModal, setShowSamplesModal] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop video stream cleanly
  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Launch device camera automatically
  const startCamera = async () => {
    stopVideoStream();
    setCameraLoading(true);
    setCameraError('');
    setUploadError('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        'Camera API is not supported in this browser environment. You can upload a label image directly using the button below.'
      );
      setCameraLoading(false);
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      let message = 'Unable to access device camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message =
          'Camera permission was denied. Please allow camera access in your browser site permissions, or upload a product label photo using the button below.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No camera device was detected on your system. Please upload a product label photo using the button below.';
      } else if (err.name === 'NotReadableError') {
        message = 'The camera is currently in use by another program or tab. Please close other camera apps and retry, or upload a label photo.';
      } else {
        message = `Camera initialization error (${err.message || 'unknown'}). Please upload a product label photo instead.`;
      }
      setCameraError(message);
      setCameraActive(false);
    } finally {
      setCameraLoading(false);
    }
  };

  // Open camera by default on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopVideoStream();
    };
  }, []);

  // Capture frame from live video stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setSelectedImage(dataUrl);
    setSelectedFileObj({
      name: `captured_label_${Date.now()}.jpg`,
      size: Math.round(dataUrl.length * 0.75),
    });

    stopVideoStream();
  };

  // Retake photo: resets captured image and restarts camera stream
  const handleRetake = () => {
    setSelectedImage(null);
    setSelectedFileObj(null);
    startCamera();
  };

  // Trigger file input dialog
  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Validate and handle file upload
  const handleFileSelect = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type (JPG, JPEG, PNG, WEBP)
    const validExtensions = /\.(jpg|jpeg|png|webp)$/i;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isNameValid = validExtensions.test(file.name);
    const isTypeValid = validTypes.includes(file.type) || file.type === '';

    if (!isNameValid && !isTypeValid) {
      setUploadError(
        'Invalid file type. Please upload a valid product label image in JPG, JPEG, PNG, or WEBP format.'
      );
      return;
    }

    // Validate size (max 12MB)
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('File size exceeds 12MB. Please select a clearer, smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      stopVideoStream();
      setSelectedImage(event.target?.result);
      setSelectedFileObj({
        name: file.name,
        size: file.size,
      });
    };
    reader.onerror = () => {
      setUploadError('Could not read the selected image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Select test preset sample
  const handleSelectSample = (sample) => {
    stopVideoStream();
    setCameraError('');
    setUploadError('');
    setSelectedImage(sample.image);
    setSelectedFileObj({
      name: `${sample.id}.jpg`,
      size: 145000,
    });
    setShowSamplesModal(false);
  };

  // Trigger optical text extraction
  const handleTriggerAnalyze = () => {
    if (!selectedImage) return;
    onScanComplete({
      imageData: selectedImage,
      fileName: selectedFileObj?.name || 'product_label.jpg',
      fileSize: selectedFileObj?.size || 0,
    });
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
      {/* Hidden processing canvas & file input */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header and Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div>
          <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider block">
            CONSUMER PORTAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Scan or Upload Product Label
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Scan or upload a packaged product label to extract declarations, verify legal metrology compliance, and assess suitability.
          </p>
        </div>

        {/* Quick sample selector */}
        <button
          type="button"
          onClick={() => setShowSamplesModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-teal-300 bg-teal-950/70 border border-teal-800 hover:bg-teal-900 transition-colors cursor-pointer self-start sm:self-center whitespace-nowrap shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Test Sample Labels</span>
        </button>
      </div>

      {/* MAIN CAMERA PREVIEW OR CAPTURED IMAGE PREVIEW */}
      {!selectedImage ? (
        <div className="space-y-4">
          {/* Camera Viewfinder Area */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 aspect-video sm:aspect-[16/9] max-h-[460px] flex items-center justify-center shadow-inner">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />

                {/* Packaging viewfinder overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 sm:p-6">
                  <div className="flex justify-between items-center text-[11px] font-mono bg-slate-950/85 text-teal-300 px-3 py-1 rounded-lg border border-teal-800/80 self-center backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                      <span>ALIGN PRODUCT LABEL WITHIN FRAME</span>
                    </span>
                  </div>

                  {/* Center scan reticle */}
                  <div className="relative w-full h-full my-2 border-2 border-dashed border-teal-500/60 rounded-xl flex items-center justify-center">
                    <div className="text-[11px] text-teal-200/90 bg-slate-900/80 px-3 py-1 rounded-md backdrop-blur-sm border border-teal-500/30">
                      Keep text flat and well-lit
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 font-mono">
                    Legal Metrology Rule 6 Packaging Scanner
                  </div>
                </div>
              </>
            ) : cameraLoading ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-950 text-teal-400 flex items-center justify-center mx-auto border border-teal-800 animate-pulse">
                  <Camera className="w-6 h-6 animate-spin" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Requesting camera access & initializing preview...
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Please tap &quot;Allow&quot; if prompted by your browser.
                </p>
              </div>
            ) : (
              /* Camera unavailable / error state */
              <div className="p-6 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-rose-950/60 text-rose-400 flex items-center justify-center mx-auto border border-rose-800">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Camera Preview Unavailable</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 max-w-sm mx-auto">
                    {cameraError || 'Device camera could not be started.'}
                  </p>
                </div>

                {/* Browser-specific permission reset instructions */}
                <div className="text-left p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-3">
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    How to allow camera access:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded bg-blue-900/60 border border-blue-700 flex items-center justify-center shrink-0 text-[9px] font-bold text-blue-300 mt-0.5">C</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-slate-200 font-semibold">Chrome / Edge:</span> Click the 🔒 lock icon in the address bar → <em>Site Settings</em> → Camera → <em>Allow</em> → reload this page.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded bg-orange-900/60 border border-orange-700 flex items-center justify-center shrink-0 text-[9px] font-bold text-orange-300 mt-0.5">F</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-slate-200 font-semibold">Firefox:</span> Click the 🔒 lock icon → <em>Connection Secure</em> → <em>More Information</em> → <em>Permissions</em> tab → Camera → <em>Allow</em>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 text-[9px] font-bold text-slate-300 mt-0.5">S</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-slate-200 font-semibold">Safari / Mobile:</span> Go to <em>Settings → Safari → Camera</em> → set to <em>Allow</em>, then reload.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded bg-teal-900/60 border border-teal-700 flex items-center justify-center shrink-0 text-[9px] font-bold text-teal-300 mt-0.5">!</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <span className="text-slate-200 font-semibold">Note:</span> Camera access requires a secure origin (<em>localhost</em> or <em>https://</em>). Also check OS camera privacy settings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button type="button" onClick={startCamera}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                    <span>Retry Camera</span>
                  </button>
                  <button type="button" onClick={handleTriggerUpload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-md transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image Instead</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Area: Primary Capture Button & Secondary Upload Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Primary Capture Label Button */}
            <button
              type="button"
              onClick={capturePhoto}
              disabled={!cameraActive}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 border border-teal-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Capture Label</span>
            </button>

            {/* Secondary Option: Upload Label Image */}
            <button
              type="button"
              onClick={handleTriggerUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-teal-400" />
              <span>Upload Label Image</span>
            </button>
          </div>

          {/* Supported format notice */}
          <p className="text-center text-[11px] text-slate-400">
            Supported image formats: <span className="text-slate-300 font-mono">JPG, JPEG, PNG, WEBP</span> (Max 12MB)
          </p>

          {/* Upload Error Banner if any */}
          {uploadError && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p>{uploadError}</p>
            </div>
          )}
        </div>
      ) : (
        /* IMAGE PREVIEW BEFORE ANALYSIS */
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-900/80 p-5 sm:p-6 rounded-2xl border border-slate-700">
            
            {/* Image Preview Box */}
            <div className="md:col-span-5 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Captured or Uploaded Label"
                className="w-full h-full object-contain"
              />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/85 text-teal-300 border border-teal-800">
                PREVIEW READY
              </span>
            </div>

            {/* Label Meta and Primary Analyze CTA */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Selected Product Label Image
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                  {selectedFileObj?.name || 'Packaged Product Image'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(selectedFileObj?.size ? selectedFileObj.size / 1024 : 0).toFixed(1)} KB • Image captured and ready for optical analysis
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Review the image above to ensure that MRP, Net Quantity, Dates, and Manufacturer address are legible before analyzing.
                </p>
              </div>

              {/* Action Buttons: Primary Analyze Label, Retake, Upload Another */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* PRIMARY: Analyze Label Button */}
                <button
                  type="button"
                  onClick={handleTriggerAnalyze}
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 text-white font-extrabold text-sm shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Analyzing Label OCR...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Analyze Label</span>
                    </>
                  )}
                </button>

                {/* Retake Photo Button */}
                <button
                  type="button"
                  onClick={handleRetake}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Retake Photo</span>
                </button>

                {/* Upload Different Image */}
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload Another Image</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* REFERENCE SAMPLES MODAL */}
      {showSamplesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <span>Select Test Reference Commodity</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Pre-configured packaged commodity labels for instant testing and evaluation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSamplesModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_PRODUCTS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-teal-500 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      {sample.category}
                    </span>
                    <span className="text-xs text-teal-400 font-bold group-hover:translate-x-0.5 transition-transform">
                      Select →
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white group-hover:text-teal-300">
                    {sample.name}
                  </h5>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Net: {sample.data.netQuantity} • MRP: {sample.data.mrp}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowSamplesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
