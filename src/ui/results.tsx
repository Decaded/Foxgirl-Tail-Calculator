import type { ComponentChildren } from "preact";
import {
	FUR_DENSITY_G_CM3,
	formProfiles,
	HEAD_RATIO,
	REF_HEIGHT_CM,
	REF_WEIGHT_KG,
	type Results,
	tailSpecs,
} from "../model";
import type { State } from "../state";
import { length, mass, volume } from "./format";

type Props = {
	state: State;
	results: Results;
};

function Card({
	label,
	value,
	sub,
	formula,
	gold,
}: {
	label: string;
	value: string;
	sub?: string;
	formula?: string;
	gold?: boolean;
}) {
	return (
		<div class="bg-raised border border-line rounded-sm p-4" title={formula}>
			<div class="text-xs font-mono uppercase tracking-widest text-text-muted">
				{label}
			</div>
			<div
				class={`mt-1 font-mono text-lg text-pretty ${gold ? "text-gold-ink" : "text-text"} ${formula ? "underline decoration-text-muted/60 decoration-dotted underline-offset-4" : ""}`}
			>
				{value}
			</div>
			{sub ? <div class="mt-0.5 text-xs text-text-muted">{sub}</div> : null}
		</div>
	);
}

function Group({
	title,
	children,
}: {
	title: string;
	children: ComponentChildren;
}) {
	return (
		<section class="space-y-3">
			<h2 class="text-xs font-mono uppercase tracking-widest text-text-muted border-b border-line pb-1">
				{title}
			</h2>
			<div class="grid grid-cols-2 gap-3">{children}</div>
		</section>
	);
}

export function ResultsPanel({ state, results }: Props) {
	const metric = state.entryUnit === "cm";

	return (
		<div class="bg-surface border border-line rounded-sm p-6 space-y-6">
			<Group title="Body">
				<Card
					label="Body weight"
					value={mass(results.bodyWeightKg, metric)}
					formula={`${REF_WEIGHT_KG} kg × (height ÷ ${REF_HEIGHT_CM})³ × build factor`}
				/>
				<Card
					label="Total weight"
					value={mass(results.totalWeightKg, metric)}
					sub="body + tails"
					formula="body weight + tail weight"
				/>
				<Card
					label="Build factor"
					value={`${results.buildFactor.toFixed(2)}×`}
					sub={results.mature ? "Mature · 25y+" : `Maturing · ${results.age}y`}
					formula="(0.9 + 0.25 × maturity) × tail load, damped by legend"
				/>
				<Card
					label="Tail weight"
					value={mass(results.tailWeightKg, metric, 2)}
					formula={`volume × ${FUR_DENSITY_G_CM3} g/cm³ × fluff × tails`}
				/>
			</Group>

			<Group title="Tail Measurements">
				<Card
					label="Length (each)"
					value={length(results.tailLengthCm, metric)}
					formula="height × species ratio × maturity × legend boost"
				/>
				<Card
					label="Base diameter"
					value={length(results.tailDiameterCm, metric)}
					formula="height × species ratio × spirit age × legend boost"
				/>
				<Card
					label="Volume (each)"
					value={volume(results.volumeEachCm3, metric)}
					formula="π × length × (r₁² + r₁·r₂ + r₂²) ÷ 3, tip = base ÷ φ"
				/>
				<Card
					label="Volume (total)"
					value={volume(results.volumeTotalCm3, metric)}
					formula="volume each × number of tails"
				/>
			</Group>

			<Group title="Ear Measurements">
				<Card
					label="Ear height"
					value={length(results.earHeightCm, metric)}
					formula={`height ÷ ${HEAD_RATIO} × 0.9 × maturity × form scale`}
				/>
				<Card
					label="Base width"
					value={length(results.earWidthCm, metric)}
					sub="width = height ÷ φ"
					formula="ear height × (0.45 → 1/φ as legend rises)"
					gold
				/>
			</Group>

			<p class="text-xs text-text-muted border border-line rounded-sm p-3">
				{formProfiles[state.form].label} form ·{" "}
				{tailSpecs[state.tailType].species} tail reference · proportions shaped
				by φ ≈ 1.618
			</p>
		</div>
	);
}
