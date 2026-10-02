import {
	ChangeDetectionStrategy,
	Component,
	provideZonelessChangeDetection,
	signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideTaiga, TuiRoot, TuiTextfield } from "@taiga-ui/core";
import { TuiInputNumber } from "@taiga-ui/kit";

@Component({
	selector: "app-root",
	imports: [ReactiveFormsModule, TuiRoot, TuiTextfield, TuiInputNumber],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<tui-root>
			<main style="max-width: 24rem; margin: 2rem auto; display: grid; gap: 1rem">
				<tui-textfield>
					<label tuiLabel>Percentage</label>
					<input #input tuiInputNumber postfix="%" [formControl]="control" />
				</tui-textfield>

				<button type="button" (click)="fill(input)">Fill "42" like Playwright</button>

				<output>Expected: "42%". Actual: {{ result() }}</output>
			</main>
		</tui-root>
	`,
})
class App {
	protected readonly control = new FormControl<number | null>(null);
	protected readonly result = signal("—");

	// Playwright fill(): focus and select, then insert the text in a later task,
	// here right after Taiga has written the postfix on focus
	protected async fill(input: HTMLInputElement) {
		this.control.setValue(null);
		input.blur();
		await new Promise((r) => setTimeout(r, 100));

		input.focus();
		input.select();
		while (!input.value) {
			await new Promise((r) => setTimeout(r));
		}
		document.execCommand("insertText", false, "42");

		await new Promise((r) => setTimeout(r, 100));
		this.result.set(JSON.stringify(input.value));
	}
}

bootstrapApplication(App, {
	providers: [provideZonelessChangeDetection(), provideTaiga()],
});
