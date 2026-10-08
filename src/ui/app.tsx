import { useEffect, useMemo, useState } from "preact/hooks";
import foxImage from "../../images/fox.png";
import { calculate } from "../model";
import {
	loadTheme,
	type State,
	saveTheme,
	stateFromUrl,
	urlFromState,
} from "../state";
import { Controls } from "./controls";
import { rankLabel } from "./format";
import { Manual } from "./manual";
import { ResultsPanel } from "./results";
import { Specimen } from "./specimen";

const focusRing =
	"focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2";

export function App() {
	const [state, setState] = useState<State>(() => ({
		...stateFromUrl(location.search),
		theme: loadTheme(),
	}));
	const [copied, setCopied] = useState(false);
	const [manual, setManual] = useState(false);
	const results = useMemo(() => calculate(state), [state]);

	const update = (patch: Partial<State>) =>
		setState((previous) => ({ ...previous, ...patch }));

	useEffect(() => {
		saveTheme(state.theme);
	}, [state.theme]);

	useEffect(() => {
		history.replaceState(null, "", urlFromState(state));
	}, [state]);

	const copyLink = async () => {
		await navigator.clipboard.writeText(location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 1200);
	};

	return (
		<div class="min-h-screen bg-bg text-text">
			<div class="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
				<header class="flex items-baseline justify-between gap-4 border-b border-line pb-4">
					<div>
						<h1 class="font-mono text-2xl font-bold text-foxfire tracking-tight">
							Kitsune Calculator
						</h1>
						<p class="text-xs text-text-muted">
							A scientific instrument for measuring foxgirls
						</p>
					</div>
					<div class="flex items-baseline gap-2">
						<button
							type="button"
							onClick={() => setManual(true)}
							class={`text-xs font-mono uppercase tracking-widest border border-line bg-raised text-text-muted hover:text-text px-3 py-2 rounded-sm transition-colors ${focusRing}`}
						>
							Manual
						</button>
						<button
							type="button"
							aria-pressed={state.theme === "light"}
							onClick={() =>
								update({ theme: state.theme === "dark" ? "light" : "dark" })
							}
							class={`text-xs font-mono uppercase tracking-widest border border-line bg-raised text-text-muted hover:text-text px-3 py-2 rounded-sm transition-colors ${focusRing}`}
						>
							Theme · {state.theme === "dark" ? "Night" : "Day"}
						</button>
					</div>
				</header>

				<main class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
					<div class="space-y-4">
						<Controls state={state} update={update} />
					</div>
					<div>
						<ResultsPanel state={state} results={results} />
					</div>
					<div class="space-y-4 flex flex-col lg:col-start-2 xl:col-start-3">
						<div class="bg-surface border border-line rounded-sm p-6 space-y-3">
							<div class="flex items-baseline justify-between gap-3 border-b border-line pb-1">
								<h2 class="text-xs font-mono uppercase tracking-widest text-text-muted">
									Specimen Plate
								</h2>
								<span class="text-[11px] font-mono uppercase tracking-widest text-gold-ink border border-gold rounded-full px-2 py-0.5">
									{rankLabel(state.tails)}
								</span>
							</div>
							<Specimen state={state} results={results} />
							<p class="text-[11px] text-text-muted text-center">
								Yes I know it looks ass. No, I won't make it better cause I am
								unable to.
								<br />
								If you can't stand it, make a proper model and send it to me.
							</p>
						</div>
						<button
							type="button"
							onClick={copyLink}
							class={`w-full bg-foxfire text-on-foxfire font-medium py-2 px-4 rounded-sm transition-colors ${focusRing}`}
						>
							{copied ? "Copied" : "Copy Share Link"}
						</button>
						<div class="flex justify-center mt-auto pt-4">
							<img
								src={foxImage}
								alt="Kitsune"
								class="w-64 h-64 max-w-full object-contain fox-glow"
							/>
						</div>
					</div>
				</main>

				<footer class="text-center text-xs text-text-muted border-t border-line pt-4 space-y-1">
					<p>
						According to ancient legends, a kitsune gains one tail every 100
						years
					</p>
					<p class="font-mono">Foxgirl Tail Calculator · v4.0</p>
					<p class="pt-3">
						Check my other projects{" "}
						<a
							href="https://decaded.dev/projects"
							target="_blank"
							rel="noreferrer"
							aria-label="Check my other projects at decaded.dev"
							class="text-foxfire hover:underline underline-offset-2"
						>
							here
						</a>
					</p>
					<p>
						<a
							href="https://github.com/Decaded/Foxgirl-Tail-Calculator"
							target="_blank"
							rel="noreferrer"
							class="text-foxfire hover:underline underline-offset-2"
						>
							Source on GitHub
						</a>
					</p>
				</footer>
			</div>
			{manual ? <Manual onClose={() => setManual(false)} /> : null}
		</div>
	);
}
