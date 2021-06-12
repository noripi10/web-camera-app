import React, { useRef } from 'react';
import styled from 'styled-components';
import { useVideo } from '../hooks/useVideo';
import { useCanvas } from '../hooks/useCanvas';
import { Link } from 'react-router-dom';

const width = 300,
	height = 200;

const HorizonView = styled.div`
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	margin-top: 3em;
`;

const CameraScreen = () => {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	const { videoState, handlePlay, handlePause } = useVideo(videoRef);

	const { canvasState, handleCapture, handleSaveBlob, handleAnalyzeOcr } =
		useCanvas(videoRef, canvasRef);

	return (
		<div
			style={{
				display: 'flex',
				flex: 1,
				justifyContent: 'center',
				alignItems: 'stretch',
				margin: 'auto',
				flexDirection: 'column',
			}}
		>
			<Link to="/">Home</Link>
			<HorizonView>
				<video ref={videoRef} style={{ width, height }} playsInline />
				<canvas
					ref={canvasRef}
					style={{ width, height, backgroundColor: '#234' }}
				/>
			</HorizonView>
			<HorizonView>
				<button onClick={handlePlay}>play</button>
				<button onClick={handlePause}>pause</button>
				<button onClick={handleCapture}>capture</button>
				<button onClick={handleSaveBlob}>save image</button>
				<button onClick={handleAnalyzeOcr}>analyze ocr</button>
			</HorizonView>
			<div>useVideo状態</div>
			<div>{JSON.stringify(videoState)}</div>
			<div>useCanvas状態</div>
			<div>{canvasState.file}</div>
			<div>{canvasState.ocrText}</div>
		</div>
	);
};

export default CameraScreen;
