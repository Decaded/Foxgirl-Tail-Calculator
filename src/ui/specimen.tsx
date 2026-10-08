import type { Results } from "../model";
import { PHI, type TailType } from "../model";
import { displayHeight, type State } from "../state";

type Pt = { x: number; y: number };

type Props = {
	state: State;
	results: Results;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const fluff: Record<TailType, { waves: number; amp: number }> = {
	sleek: { waves: 3, amp: 0.03 },
	bushy: { waves: 5, amp: 0.09 },
	fluffy: { waves: 7, amp: 0.17 },
};

const tailAngle = (index: number, tails: number) =>
	tails === 1 ? 58 : 25 + index * (67 / (tails - 1));

function quadratic(p0: Pt, c: Pt, p1: Pt, t: number): Pt {
	const u = 1 - t;
	return {
		x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
		y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
	};
}

function quadraticTangent(p0: Pt, c: Pt, p1: Pt, t: number): Pt {
	return {
		x: 2 * (1 - t) * (c.x - p0.x) + 2 * t * (p1.x - c.x),
		y: 2 * (1 - t) * (c.y - p0.y) + 2 * t * (p1.y - c.y),
	};
}

function tailOutline(
	base: Pt,
	angleDeg: number,
	length: number,
	baseWidth: number,
	style: { waves: number; amp: number },
) {
	const a = (angleDeg * Math.PI) / 180;
	const dir = { x: -Math.cos(a), y: -Math.sin(a) };
	const tip: Pt = { x: base.x + dir.x * length, y: base.y + dir.y * length };
	const normal = { x: dir.y, y: -dir.x };
	const control: Pt = {
		x: base.x + dir.x * length * 0.5 + normal.x * length * 0.22,
		y: base.y + dir.y * length * 0.5 + normal.y * length * 0.22,
	};

	const samples = 16;
	const left: Pt[] = [];
	const right: Pt[] = [];

	for (let i = 0; i <= samples; i++) {
		const t = i / samples;
		const point = quadratic(base, control, tip, t);
		const tangent = quadraticTangent(base, control, tip, t);
		const len = Math.hypot(tangent.x, tangent.y) || 1;
		const nx = -tangent.y / len;
		const ny = tangent.x / len;
		const wave = Math.sin(t * style.waves * Math.PI * 2) * style.amp;
		const half = (lerp(baseWidth, baseWidth / PHI, t) * (1 + wave)) / 2;
		left.push({ x: point.x + nx * half, y: point.y + ny * half });
		right.push({ x: point.x - nx * half, y: point.y - ny * half });
	}

	const d = [
		`M ${left[0].x.toFixed(2)} ${left[0].y.toFixed(2)}`,
		...left.slice(1).map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`),
		...right.reverse().map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`),
		"Z",
	].join(" ");

	return { d, tip, control };
}

function dimensionText(cm: number, state: State) {
	const value = displayHeight(cm, state.entryUnit);
	const rounded = value >= 100 ? value.toFixed(0) : value.toFixed(1);
	return `${rounded} ${state.entryUnit}`;
}

export function Specimen({ state, results }: Props) {
	const h = results.heightCm;
	const worldHeight = h * 1.2 + 34;
	const worldWidth = h * 1.05 + 62;
	const groundY = worldHeight - 16;
	const unit = state.entryUnit;

	const quad = state.form === "animal";
	const hipFrac = state.form === "hybrid" ? 0.47 : 0.5;
	const stoop = state.form === "hybrid" ? h * 0.03 : 0;

	const bodyX = worldWidth * 0.62;
	const headR = results.headHeightCm / 2;

	const hip: Pt = quad
		? { x: bodyX - h * 0.32, y: groundY - h * 0.92 }
		: { x: bodyX, y: groundY - h * hipFrac };
	const shoulder: Pt = quad
		? { x: bodyX + h * 0.3, y: groundY - h * 0.94 }
		: { x: bodyX + stoop, y: groundY - h * 0.78 };
	const neck: Pt = quad
		? { x: shoulder.x + h * 0.08, y: shoulder.y - h * 0.05 }
		: { x: bodyX + stoop * 1.3, y: groundY - h * 0.845 };
	const head: Pt = quad
		? { x: neck.x + headR * 0.8, y: neck.y - headR * 0.4 }
		: { x: neck.x + headR * 0.3, y: neck.y - headR * 0.95 };

	const fanOrigin: Pt = quad
		? { x: hip.x - headR * 0.2, y: hip.y - h * 0.03 }
		: { x: bodyX - h * 0.03, y: hip.y - h * 0.03 };

	const tailCount = Math.round(state.tails);
	const tails = Array.from({ length: tailCount }, (_, i) => {
		const angle = tailAngle(i, tailCount);
		return tailOutline(
			fanOrigin,
			angle,
			results.tailLengthCm,
			results.tailDiameterCm,
			fluff[state.tailType],
		);
	});

	const middleTail = tails[Math.floor(tails.length / 2)];

	const earTipY = head.y - headR * 0.75 - results.earHeightCm;
	const earCx = head.x + headR * 0.5;
	const earMirrorCx = 2 * head.x - earCx;

	const dimX = bodyX + h * 0.16 + 14;
	const tick = 3;
	const fontSize = worldWidth / 40;

	return (
		<svg
			viewBox={`0 0 ${worldWidth.toFixed(0)} ${worldHeight.toFixed(0)}`}
			class="w-full h-auto max-w-md mx-auto"
			role="img"
			aria-label={`Specimen diagram: ${state.tails}-tail kitsune, ${dimensionText(h, state)} tall, ${state.tailType} tails`}
		>
			<defs>
				<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
					<path
						d="M 10 0 L 0 0 0 10"
						fill="none"
						class="stroke-violet"
						stroke-width="0.25"
						opacity="0.35"
					/>
				</pattern>
			</defs>

			<rect
				x="0"
				y="0"
				width={worldWidth}
				height={worldHeight}
				fill="url(#grid)"
			/>
			<line
				x1="4"
				y1={groundY}
				x2={worldWidth - 4}
				y2={groundY}
				class="stroke-text-muted"
				stroke-width="0.6"
			/>

			{Array.from({ length: Math.floor(worldWidth / 10) }, (_, i) => {
				const x = (i + 1) * 10;
				const major = x % 50 === 0;
				return (
					<g key={`tick-${x}`}>
						<line
							x1={x}
							y1={groundY}
							x2={x}
							y2={groundY + (major ? 4 : 2)}
							class="stroke-text-muted"
							stroke-width="0.5"
						/>
						{major ? (
							<text
								x={x}
								y={groundY + 11}
								text-anchor="middle"
								class="fill-text-muted font-mono"
								font-size={fontSize * 0.75}
							>
								{displayHeight(x, unit).toFixed(0)}
							</text>
						) : null}
					</g>
				);
			})}
			<text
				x={worldWidth - 4}
				y={groundY + 11}
				text-anchor="end"
				class="fill-text-muted font-mono uppercase"
				font-size={fontSize * 0.75}
				letter-spacing="0.1em"
			>
				{unit}
			</text>

			<g
				class="tail-sway"
				style={{ transformOrigin: `${fanOrigin.x}px ${fanOrigin.y}px` }}
			>
				{tails.map((tail, i) => (
					<path
						key={`tail-${i}`}
						d={tail.d}
						class="fill-foxfire/15 stroke-foxfire foxfire-glow"
						stroke-width="1.4"
						vector-effect="non-scaling-stroke"
						style={{ animationDelay: `${i * -0.9}s` }}
					/>
				))}
			</g>

			<g
				class="stroke-violet"
				stroke-linecap="round"
				fill="none"
				stroke-width="1.4"
				vector-effect="non-scaling-stroke"
			>
				{quad ? (
					<>
						<path
							d={`M ${hip.x} ${hip.y} Q ${bodyX} ${hip.y + h * 0.04} ${shoulder.x} ${shoulder.y}`}
						/>
						<path d={`M ${shoulder.x} ${shoulder.y} L ${neck.x} ${neck.y}`} />
						<path
							d={`M ${hip.x} ${hip.y} L ${hip.x - h * 0.05} ${groundY - h * 0.45} L ${hip.x - h * 0.03} ${groundY}`}
						/>
						<path
							d={`M ${hip.x + h * 0.04} ${hip.y + h * 0.02} L ${hip.x + h * 0.03} ${groundY - h * 0.4} L ${hip.x + h * 0.06} ${groundY}`}
						/>
						<path
							d={`M ${shoulder.x} ${shoulder.y} L ${shoulder.x - h * 0.02} ${groundY - h * 0.45} L ${shoulder.x} ${groundY}`}
						/>
						<path
							d={`M ${shoulder.x + h * 0.03} ${shoulder.y + h * 0.03} L ${shoulder.x + h * 0.04} ${groundY - h * 0.42} L ${shoulder.x + h * 0.05} ${groundY}`}
						/>
					</>
				) : (
					<>
						<path d={`M ${hip.x} ${hip.y} L ${neck.x} ${neck.y}`} />
						<path
							d={`M ${hip.x - h * 0.02} ${hip.y} L ${bodyX - h * 0.05} ${groundY - h * 0.22} L ${bodyX - h * 0.06} ${groundY}`}
						/>
						<path
							d={`M ${hip.x + h * 0.03} ${hip.y} L ${bodyX + h * 0.05} ${groundY - h * 0.22} L ${bodyX + h * 0.07} ${groundY}`}
						/>
						<path
							d={`M ${shoulder.x} ${shoulder.y} L ${bodyX + h * 0.08} ${groundY - h * 0.6} L ${bodyX + h * 0.1} ${groundY - h * 0.45}`}
						/>
					</>
				)}
				<circle cx={head.x} cy={head.y} r={headR} />
			</g>

			<g
				class="stroke-gold"
				fill="none"
				stroke-width="1.4"
				vector-effect="non-scaling-stroke"
			>
				<path
					d={`M ${earCx - results.earWidthCm / 2} ${head.y - headR * 0.75} L ${earCx + results.earWidthCm * 0.2} ${earTipY} L ${earCx + results.earWidthCm / 2} ${head.y - headR * 0.75}`}
				/>
				<path
					d={`M ${earMirrorCx + results.earWidthCm / 2} ${head.y - headR * 0.75} L ${earMirrorCx - results.earWidthCm * 0.2} ${earTipY} L ${earMirrorCx - results.earWidthCm / 2} ${head.y - headR * 0.75}`}
				/>
			</g>

			<g class="stroke-text-muted" stroke-width="0.7">
				<line x1={dimX} y1={groundY} x2={dimX} y2={head.y - headR} />
				<line x1={dimX - tick} y1={groundY} x2={dimX + tick} y2={groundY} />
				<line
					x1={dimX - tick}
					y1={head.y - headR}
					x2={dimX + tick}
					y2={head.y - headR}
				/>
				<line
					x1={fanOrigin.x}
					y1={fanOrigin.y}
					x2={middleTail.tip.x}
					y2={middleTail.tip.y}
					stroke-dasharray="2 2"
				/>
			</g>

			<text
				x={dimX - 4}
				y={(groundY + head.y - headR) / 2}
				text-anchor="middle"
				class="fill-text font-mono"
				font-size={fontSize}
				transform={`rotate(-90 ${dimX - 4} ${(groundY + head.y - headR) / 2})`}
			>
				{dimensionText(h, state)}
			</text>

			<text
				x={(fanOrigin.x + middleTail.tip.x) / 2}
				y={(fanOrigin.y + middleTail.tip.y) / 2 - 3}
				text-anchor="middle"
				class="fill-text font-mono"
				font-size={fontSize}
			>
				{dimensionText(results.tailLengthCm, state)}
			</text>

			<text
				x={earCx + 4}
				y={earTipY - 3}
				class="fill-gold-ink font-mono"
				font-size={fontSize * 0.85}
			>
				÷ φ
			</text>
			<text
				x={earCx + 4}
				y={earTipY - 3 - fontSize}
				class="fill-gold-ink font-mono"
				font-size={fontSize * 0.85}
			>
				{dimensionText(results.earHeightCm, state)}
			</text>
		</svg>
	);
}
