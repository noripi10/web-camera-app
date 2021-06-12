import { useEffect, useState, useCallback } from 'react';

const useVideo = (videoRef) => {
	const [videoState, setVideoState] = useState({
		canPlay: false,
		pause: false,
		playing: false,
	});

	const hasUserMedia = () => {
		const result = !!(
			navigator.mediaDevices && navigator.mediaDevices.getUserMedia
		);
		console.log({ result });
		return result;
	};

	console.log('videoRef', videoRef);

	useEffect(() => {
		(async () => {
			if (hasUserMedia() && videoRef.current) {
				const video = videoRef.current;
				// permission
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						width: video.width,
						height: video.height,
						facingMode: 'user', // in camera
					},
					audio: false,
				});
				// video要素へストリーミング情報を渡す
				video.srcObject = stream;

				// 再生可能状態
				video.oncanplay = () => {
					setVideoState((prev) => ({ ...prev, canPlay: true }));
				};
				// 再生中
				video.onplay = () => {
					setVideoState((prev) => ({ ...prev, playing: true, pause: false }));
				};
				// 停止中
				video.onpause = () => {
					setVideoState((prev) => ({ ...prev, playing: false, pause: true }));
				};
			}
		})();
	}, [videoRef]);

	const handlePlay = useCallback(() => {
		const video = videoRef.current;
		if (video !== null) {
			video.play();
		}
	}, [videoRef]);

	const handlePause = useCallback(() => {
		const video = videoRef.current;
		if (video !== null) {
			video.pause();
		}
	}, [videoRef]);

	return {
		videoState,
		handlePlay,
		handlePause,
	};
};

export { useVideo };
