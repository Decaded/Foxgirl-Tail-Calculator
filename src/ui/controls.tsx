import type { ComponentChildren } from "preact";
import {
	type BodyForm,
	formProfiles,
	type TailType,
	tailSpecs,
} from "../model";
import {
	displayHeight,
	type EntryUnit,
	presetPatch,
	presets,
	randomPatch,
	type State,
	toHeightCm,
} from "../state";
import { loreLabel } from "./format";

type Props = {
	state: State;
	update: (patch: Partial<State>) => void;
};

const focusRing =
	"focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2";

function Segmented<T extends string>({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: { value: T; label: string; title?: string }[];
	value: T;
	onChange: (value: T) => void;
}) {
	return (
		<fieldset
			class="grid gap-2 m-0 p-0 border-0"
			style={{
				gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
			}}
		>
			<legend class="sr-only">{label}</legend>
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					title={option.title}
					aria-pressed={value === option.value}
					onClick={() => onChange(option.value)}
					class={`py-2 px-3 rounded-sm text-sm font-medium transition-colors border ${focusRing} ${
						value === option.value
							? "bg-foxfire border-foxfire text-on-foxfire"
							: "bg-raised border-line text-text-muted hover:text-text"
					}`}
				>
					{option.label}
				</button>
			))}
		</fieldset>
	);
}

function NumberField({
	id,
	label,
	value,
	min,
	max,
	step,
	onChange,
	trailing,
}: {
	id: string;
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
	trailing?: ComponentChildren;
}) {
	return (
		<div class="space-y-2">
			<label
				for={id}
				class="block text-xs font-mono uppercase tracking-widest text-text-muted"
			>
				{label}
			</label>
			<div class="flex items-center gap-2">
				<input
					id={id}
					type="number"
					class={`flex-1 min-w-0 bg-raised border border-line rounded-sm px-3 py-2 font-mono text-text ${focusRing}`}
					value={value}
					min={min}
					max={max}
					step={step}
					onInput={(event) => {
						const raw = event.currentTarget.value;
						const parsed = Number(raw);
						if (raw !== "" && Number.isFinite(parsed)) onChange(parsed);
					}}
				/>
				{trailing}
			</div>
		</div>
	);
}

function RangeField({
	id,
	label,
	display,
	value,
	min,
	max,
	step,
	valueText,
	onChange,
	endpoints,
}: {
	id: string;
	label: string;
	display: string;
	value: number;
	min: number;
	max: number;
	step: number;
	valueText: string;
	onChange: (value: number) => void;
	endpoints: [string, string];
}) {
	return (
		<div class="space-y-2">
			<div class="flex items-baseline justify-between">
				<label
					for={id}
					class="text-xs font-mono uppercase tracking-widest text-text-muted"
				>
					{label}
				</label>
				<span class="font-mono text-sm text-text">{display}</span>
			</div>
			<input
				id={id}
				type="range"
				class="w-full accent-foxfire"
				value={value}
				min={min}
				max={max}
				step={step}
				aria-valuetext={valueText}
				onInput={(event) => onChange(Number(event.currentTarget.value))}
			/>
			<div class="flex justify-between text-[11px] text-text-muted">
				<span>{endpoints[0]}</span>
				<span>{endpoints[1]}</span>
			</div>
		</div>
	);
}

function Section({
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
			{children}
		</section>
	);
}

export function Controls({ state, update }: Props) {
	const metric = state.entryUnit === "cm";

	return (
		<div class="bg-surface border border-line rounded-sm p-6 space-y-6">
			<Section title="Archetypes">
				<div class="flex flex-wrap gap-2">
					{presets.map((preset) => {
						const active =
							state.heightCm === preset.heightCm &&
							state.age === preset.age &&
							state.tails === preset.tails &&
							state.tailType === preset.tailType &&
							state.legend === preset.legend &&
							state.form === preset.form;
						return (
							<button
								key={preset.name}
								type="button"
								aria-pressed={active}
								title={`${preset.age} years · ${preset.tails} ${preset.tails === 1 ? "tail" : "tails"} · ${preset.tailType}`}
								onClick={() => update(presetPatch(preset))}
								class={`py-1.5 px-2.5 rounded-sm text-xs font-mono transition-colors border ${focusRing} ${
									active
										? "bg-foxfire border-foxfire text-on-foxfire"
										: "bg-raised border-line text-text-muted hover:text-text"
								}`}
							>
								{preset.name} ({preset.tails})
							</button>
						);
					})}
					<button
						type="button"
						onClick={() => update(randomPatch())}
						class={`py-1.5 px-2.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-colors border border-foxfire text-foxfire hover:bg-foxfire hover:text-on-foxfire ${focusRing}`}
					>
						Randomize
					</button>
				</div>
			</Section>

			<Section title="Body Form">
				<Segmented
					label="Body form"
					value={state.form}
					onChange={(form) => update({ form })}
					options={(Object.keys(formProfiles) as BodyForm[]).map((form) => ({
						value: form,
						label: formProfiles[form].label,
					}))}
				/>
				<p class="pt-2 text-xs text-text-muted">
					Silhouette and proportion only
				</p>
			</Section>

			<Section title="Height">
				<NumberField
					id="height"
					label={metric ? "Height (cm)" : "Height (in)"}
					value={Number(
						displayHeight(state.heightCm, state.entryUnit).toFixed(1),
					)}
					min={4}
					max={200}
					step={0.1}
					onChange={(value) =>
						update({ heightCm: toHeightCm(value, state.entryUnit) })
					}
					trailing={
						<div class="w-32 shrink-0">
							<Segmented
								label="Height unit"
								value={state.entryUnit}
								onChange={(entryUnit: EntryUnit) => update({ entryUnit })}
								options={[
									{ value: "cm" as const, label: "cm" },
									{ value: "in" as const, label: "in" },
								]}
							/>
						</div>
					}
				/>
			</Section>

			<Section title="Age">
				<NumberField
					id="age"
					label="Age (years)"
					value={state.age}
					min={1}
					max={9999}
					step={1}
					onChange={(age) => update({ age })}
				/>
			</Section>

			<Section title="Tails">
				<RangeField
					id="tails"
					label={`Number of tails (${state.tails})`}
					display={`${state.tails}`}
					value={state.tails}
					min={1}
					max={9}
					step={1}
					valueText={`${state.tails} ${state.tails === 1 ? "tail" : "tails"}`}
					onChange={(tails) => update({ tails })}
					endpoints={["Nogitsune (1)", "Kyūbi (9)"]}
				/>
			</Section>

			<Section title="Tail Type">
				<Segmented
					label="Tail type"
					value={state.tailType}
					onChange={(tailType: TailType) => update({ tailType })}
					options={[
						{ value: "sleek" as const, label: "Sleek", title: "Fennec Fox" },
						{ value: "bushy" as const, label: "Bushy", title: "Red Fox" },
						{ value: "fluffy" as const, label: "Fluffy", title: "Arctic Fox" },
					]}
				/>
				<p class="pt-2 text-xs text-text-muted">
					Based on {tailSpecs[state.tailType].species}
				</p>
			</Section>

			<Section title="Legend Factor">
				<RangeField
					id="legend"
					label={`Legend factor (${state.legend.toFixed(2)})`}
					display={state.legend.toFixed(2)}
					value={state.legend}
					min={0}
					max={1}
					step={0.01}
					valueText={loreLabel(state.legend)}
					onChange={(legend) => update({ legend })}
					endpoints={["Realism", "Legend"]}
				/>
				<p class="text-center text-xs font-mono uppercase tracking-widest text-gold-ink">
					{formProfiles[state.form].label} — {loreLabel(state.legend)}
				</p>
			</Section>
		</div>
	);
}
