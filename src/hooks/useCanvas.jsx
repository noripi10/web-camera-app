import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

const toBase64 = (canvas) => {
	const base64 = canvas.toDataURL('image/jpeg');
	return base64;
};

// eslint-disable-next-line
const toBlob = (base64) => {
	const tmp = base64.split(',');
	const data = atob(tmp[1]);
	const mine = tmp[0].split(':')[1].split(';')[0];
	const buffer = new Uint8Array(data.length);

	for (let i = 0; i < data.length; i++) {
		buffer[i] = data.charCodeAt(i);
	}

	const blog = new Blob([buffer], { type: mine });
	return blog;
};

const useCanvas = (videoRef, canvasRef) => {
	const [canvasState, setCanvasState] = useState({
		file: null, //base64形式でステート
		ocrText: '',
	});

	const handleCapture = useCallback(
		async (e) => {
			e.preventDefault();

			const canvas = canvasRef.current;
			const video = videoRef.current;

			if (canvas !== null && video !== null) {
				const context = canvas.getContext('2d');
				if (context !== null) {
					context.drawImage(video, 0, 0, canvas.width, canvas.height);

					const base64 = toBase64(canvas);
					console.log({ base64 });
					setCanvasState((prev) => ({ ...prev, file: base64 }));
				}
			} else {
				alert('ストリームまたはキャンバスが見つかりません');
			}
		},
		[videoRef, canvasRef]
	);

	const handleSaveBlob = () => {
		if (!canvasState.file) {
			return false;
		}

		// base64からblobへ変換
		const blob = toBlob(canvasState.file);
		const dataUrl = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = dataUrl;
		a.target = '_blank';
		a.click();
		a.remove();
	};

	const handleAnalyzeOcr = useCallback(async () => {
		if (!canvasState.file) {
			return false;
		}

		const worker = createWorker({
			logger: (log) => console.log({ log }),
		});

		try {
			await worker.load();
			await worker.loadLanguage('eng');
			await worker.initialize('eng');
			const {
				data: { text },
			} = await worker.recognize(canvasState.file);
			console.log({ text });
			setCanvasState((prev) => ({ ...prev, ocrText: text }));
			await worker.terminate();
		} catch (error) {
			alert(error.message);
		} finally {
		}
	}, [canvasState.file]);

	return { canvasState, handleCapture, handleSaveBlob, handleAnalyzeOcr };
};

export { useCanvas };
