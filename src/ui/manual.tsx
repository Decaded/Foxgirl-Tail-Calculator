import { useEffect, useRef } from 'preact/hooks';
import { FUR_DENSITY_G_CM3, formProfiles, HEAD_RATIO, MATURITY_AGE, PHI, REF_HEIGHT_CM, REF_WEIGHT_KG, SPIRIT_REFERENCE_AGE, type TailType, tailSpecs } from '../model';
import { presets } from '../state';
import { loreLabel } from './format';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2';

const loreThresholds = [0, 0.2, 0.45, 0.65, 0.85];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
	return (
		<div class='overflow-x-auto'>
			<table class='w-full text-xs font-mono border-collapse'>
				<thead>
					<tr class='border-b border-line text-text-muted uppercase tracking-widest'>
						{head.map(cell => (
							<th class='py-1 pr-3 text-left font-medium'>{cell}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map(row => (
						<tr class='border-b border-line/50'>
							{row.map(cell => (
								<td class='py-1 pr-3 text-text'>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function Manual({ onClose }: { onClose: () => void }) {
	const closeRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		closeRef.current?.focus();
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose]);

	return (
		<div class='fixed inset-0 z-50 bg-bg/80 overflow-y-auto p-4'>
			<div
				role='dialog'
				aria-modal='true'
				aria-labelledby='manual-title'
				class='mx-auto my-8 max-w-2xl bg-surface border border-line rounded-sm p-6 space-y-5'
			>
				<header class='flex items-baseline justify-between border-b border-line pb-3'>
					<h2
						id='manual-title'
						class='font-mono text-lg font-bold text-foxfire tracking-tight'
					>
						Operator's Manual
					</h2>
					<button
						ref={closeRef}
						type='button'
						onClick={onClose}
						class={`text-xs font-mono uppercase tracking-widest border border-line bg-raised text-text-muted hover:text-text px-3 py-1.5 rounded-sm transition-colors ${focusRing}`}
					>
						Close · Esc
					</button>
				</header>

				<section class='space-y-2'>
					<h3 class='text-xs font-mono uppercase tracking-widest text-text-muted'>What this instrument does</h3>
					<p class='text-sm text-text'>
						Computes the body, tail and ear measurements of a kitsune from height, age, tail count and legend factor — fox anatomy scaled by the golden ratio φ, cone-frustum tail
						volumes and fur density {FUR_DENSITY_G_CM3} g/cm³. All numbers below are read from the same constants the calculator uses.
					</p>
				</section>

				<section class='space-y-2'>
					<h3 class='text-xs font-mono uppercase tracking-widest text-text-muted'>Inputs</h3>
					<Table
						head={['Input', 'Range', 'Effect']}
						rows={[
							['Height', '4–200 (entry unit)', 'reference for every proportion'],
							['Age', '1–9999 y', `maturity at ${MATURITY_AGE} y, spirit factor → ${SPIRIT_REFERENCE_AGE} y`],
							['Tails', '1–9', 'weight and length index per extra tail'],
							['Tail type', 'sleek / bushy / fluffy', 'species ratios below'],
							['Body form', 'humanoid / hybrid / animal', 'posture + size scale'],
							['Legend', '0–1', 'visual boost, ear width toward 1/φ'],
						]}
					/>
					<p class='text-xs text-text-muted'>
						Legend reading:{' '}
						{loreThresholds.map((t, i) => (i === loreThresholds.length - 1 ? `≥ ${t} ${loreLabel(t)}` : `${t}–${loreThresholds[i + 1]} ${loreLabel(t)}`)).join(' · ')}
					</p>
				</section>

				<section class='space-y-2'>
					<h3 class='text-xs font-mono uppercase tracking-widest text-text-muted'>Constants</h3>
					<Table
						head={['Symbol', 'Value', 'Meaning']}
						rows={[
							['φ', PHI.toFixed(6), 'golden ratio: tip diameter, ear width'],
							[`${REF_WEIGHT_KG} kg / ${REF_HEIGHT_CM} cm`, '1.000', 'reference body, cubed scaling'],
							[`${FUR_DENSITY_G_CM3} g/cm³`, '1.050', 'fur + tissue density for tail mass'],
							[`${MATURITY_AGE} y`, '25', 'physical maturity plateau'],
							['head ratio', `${HEAD_RATIO}:1`, 'head height = height ÷ ratio'],
							[`${SPIRIT_REFERENCE_AGE} y`, '9000', 'spiritual age normalization (log scale)'],
						]}
					/>
				</section>

				<section class='space-y-2'>
					<h3 class='text-xs font-mono uppercase tracking-widest text-text-muted'>Tail species reference</h3>
					<Table
						head={['Tail type', 'Species', 'Length', 'Diameter', 'Fur mass']}
						rows={(Object.keys(tailSpecs) as TailType[]).map(type => {
							const spec = tailSpecs[type];
							return [type, spec.species, `${spec.lengthRatio} × height`, `${spec.diameterRatio} × height`, `${spec.furMassFactor}×`];
						})}
					/>
				</section>

				<section class='space-y-2'>
					<h3 class='text-xs font-mono uppercase tracking-widest text-text-muted'>Archetypes</h3>
					<Table
						head={['Rank', 'Age', 'Tails', 'Height', 'Tail', 'Legend']}
						rows={presets.map(preset => [preset.name, `${preset.age} y`, String(preset.tails), `${preset.heightCm} cm`, preset.tailType, preset.legend.toFixed(2)])}
					/>
				</section>

				<section class='space-y-2'>
					<h3 class='text-xs font-mono uppercase tracking-widest text-text-muted'>Body forms</h3>
					<Table
						head={['Form', 'Height scale', 'Ear scale']}
						rows={(Object.keys(formProfiles) as (keyof typeof formProfiles)[]).map(form => [
							formProfiles[form].label,
							`${formProfiles[form].heightScale}×`,
							`${formProfiles[form].earScale}×`,
						])}
					/>
				</section>

				<section class='space-y-2'>
					<h3 class='text-xs font-mono uppercase tracking-widest text-text-muted'>Notes</h3>
					<p class='text-sm text-text-muted'>
						Units follow the height field (cm or in); "Copy Share Link" encodes the whole state in the URL; Night/Day themes persist in this browser; motion honors
						prefers-reduced-motion. The Specimen Plate is drawn live from these same results — no artwork is involved.
					</p>
				</section>
			</div>
		</div>
	);
}
