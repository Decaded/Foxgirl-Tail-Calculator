import { describe, expect, it } from "vitest";
import {
	defaultState,
	displayHeight,
	stateFromUrl,
	toHeightCm,
	urlFromState,
} from "../src/state";

describe("url state", () => {
	it("round-trips", () => {
		const state = {
			...defaultState,
			heightCm: 172.5,
			tails: 9,
			tailType: "fluffy" as const,
		};
		expect(stateFromUrl(urlFromState(state))).toEqual(state);
	});

	it("falls back to defaults on garbage", () => {
		expect(stateFromUrl("?h=abc&a=&t=99&tt=spiky&l=&form=ghost")).toEqual({
			...defaultState,
			tails: 9,
		});
	});
});

describe("units", () => {
	it("round-trips cm <-> in", () => {
		expect(toHeightCm(displayHeight(165, "in"), "in")).toBeCloseTo(165);
		expect(toHeightCm(displayHeight(165, "cm"), "cm")).toBe(165);
	});

	it("keeps the actual height when switching entry unit", () => {
		const heightCm = 165;
		const inInches = displayHeight(heightCm, "in");
		expect(toHeightCm(inInches, "in")).toBeCloseTo(heightCm);
	});
});
