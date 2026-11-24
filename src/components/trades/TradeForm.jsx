// "Log a trade" / "Edit trade" panel. Fields mirror the Notion "Trades Journal" columns, plus P&L ($).
import { useState } from "react";
import { MARKET_CONDITIONS, RESULTS, TRADE_TYPES } from "../../constants/journalOptions.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useTrades } from "../../context/TradesContext.jsx";
import { useCustomOptions } from "../../hooks/useCustomOptions.js";
import { todayISO } from "../../utils/dates.js";
import { emptyTradeForm, parseAmount, tradeToForm, validateTradeForm } from "../../utils/trade.js";
import Field from "../common/Field.jsx";
import SidePanel from "../common/SidePanel.jsx";
import { AddOptionChip, ChipGroup, SegmentedControl } from "./OptionChips.jsx";
import PairPicker from "./PairPicker.jsx";

/**
 * @param {{ tradeId?: string, defaults?: object, onClose: () => void }} props
 *   Pass tradeId to edit an existing trade; otherwise a new trade is logged (with optional defaults, e.g. { pair }).
 */
export default function TradeForm({ tradeId, defaults, onClose }) {
  const { trades, addTrade, editTrade } = useTrades();
  const { showToast } = useToast();
  const options = useCustomOptions();
  const existing = tradeId ? trades.find((t) => t.id === tradeId) : null;

  const [form, setForm] = useState(() => (existing ? tradeToForm(existing) : emptyTradeForm(defaults)));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  };

  // Adds a custom option, selects it, and returns an error message if it couldn't be saved.
  const addCustomOption = (key, field, text) => {
    let value = text;
    if (key === "risk") {
      const percent = parseAmount(text.replace("%", ""));
      if (!(percent > 0 && percent <= 100)) return "Enter a number between 0 and 100.";
      value = `${+percent.toFixed(2)}%`;
    }
    try {
      const saved = options.addOption(key, value);
      setField(field, Array.isArray(form[field]) ? [...new Set([...form[field], saved])] : saved);
    } catch (error) {
      return error.message;
    }
  };

  const removeCustomOption = (key, field, value) => {
    try {
      options.removeOption(key, value);
    } catch (error) {
      return showToast(error.message, "error");
    }
    const current = form[field];
    if (Array.isArray(current)) setField(field, current.filter((v) => v !== value));
    else if (current === value) setField(field, options.optionsFor(key)[0]);
  };

  const customChips = (key, field) => ({
    options: options.optionsFor(key),
    value: form[field],
    onChange: (v) => setField(field, v),
    isRemovable: (v) => options.isCustom(key, v),
    onRemove: (v) => removeCustomOption(key, field, v),
    addControl: <AddOptionChip optionKey={key} onAdd={(text) => addCustomOption(key, field, text)} />,
  });

  const handleSave = async () => {
    if (saving) return;
    const { errors: found, values } = validateTradeForm(form, { existingTrades: trades, editingId: tradeId });
    if (!values) {
      setErrors(found);
      return;
    }
    setSaving(true);
    try {
      const trade = existing ? await editTrade(tradeId, values) : await addTrade(values);
      showToast(existing ? `Updated ${trade.pair} ${trade.type}` : `Saved ${trade.pair} ${trade.type}`);
      onClose();
    } catch (error) {
      setSaving(false);
      showToast(error.message, "error");
    }
  };

  if (tradeId && !existing) {
    return (
      <SidePanel title="Edit trade" onClose={onClose}>
        <p className="text-muted">This trade no longer exists. It may have been deleted.</p>
      </SidePanel>
    );
  }

  const isBreakeven = form.result === "BREAKEVEN";

  return (
    <SidePanel
      title={existing ? "Edit trade" : "Log a trade"}
      onClose={onClose}
      footer={
        <>
          <button className="btn flex-1 sm:flex-none" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary flex-1 disabled:opacity-60 sm:flex-none" type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : existing ? "Save changes" : "Save trade"}
          </button>
        </>
      }
    >
      {errors.form && (
        <p className="rounded-[9px] border border-loss/40 bg-loss/10 px-3 py-2.5 text-[0.8125rem] text-loss" role="alert">{errors.form}</p>
      )}

      <div className="grid gap-4 min-[400px]:grid-cols-2 min-[400px]:gap-3.5">
        <Field label="Pair" error={errors.pair}>
          <PairPicker value={form.pair} onChange={(v) => setField("pair", v)} invalid={!!errors.pair} />
        </Field>
        <Field label="Trade date" htmlFor="trade-date" error={errors.date}>
          <input id="trade-date" className={`input ${errors.date ? "border-loss" : ""}`} type="date" max={todayISO()}
            value={form.date} onChange={(e) => setField("date", e.target.value)} />
        </Field>
      </div>

      <Field label="Trade type" error={errors.type}>
        <SegmentedControl options={TRADE_TYPES} value={form.type} onChange={(v) => setField("type", v)} />
      </Field>
      <Field label="Entry method" error={errors.entryMethod}>
        <ChipGroup {...customChips("entry", "entryMethod")} />
      </Field>
      <Field label="Market conditions">
        <ChipGroup options={MARKET_CONDITIONS} value={form.marketConditions} onChange={(v) => setField("marketConditions", v)} />
      </Field>
      <Field label="Positive confluences">
        <ChipGroup {...customChips("pos", "positiveConfluences")} />
      </Field>
      <Field label="Negative confluences">
        <ChipGroup {...customChips("neg", "negativeConfluences")} />
      </Field>
      <Field label="Risk level" error={errors.riskLevel} hint="Your custom options are saved in this browser and show up every time you log a trade.">
        <ChipGroup {...customChips("risk", "riskLevel")} />
      </Field>

      <div className="grid grid-cols-2 gap-3.5">
        <Field label="RR ratio" htmlFor="rr-ratio" error={errors.rrRatio}>
          <input id="rr-ratio" className={`input num ${errors.rrRatio ? "border-loss" : ""}`} inputMode="decimal" placeholder="2.4"
            value={form.rrRatio} onChange={(e) => setField("rrRatio", e.target.value)} />
        </Field>
        <Field label="Max RR" htmlFor="max-rr" error={errors.maxRr}>
          <input id="max-rr" className={`input num ${errors.maxRr ? "border-loss" : ""}`} inputMode="decimal" placeholder="2"
            value={form.maxRr} onChange={(e) => setField("maxRr", e.target.value)} />
        </Field>
      </div>

      <Field label="Result" error={errors.result}>
        <SegmentedControl options={RESULTS} value={form.result} onChange={(v) => setField("result", v)} layout="grid grid-cols-2 min-[400px]:grid-cols-4" />
      </Field>
      <Field
        label="P&L ($)"
        htmlFor="pnl"
        error={errors.pnl}
        hint={isBreakeven ? "Breakeven trades are saved with $0." : "Use a minus sign for losses. For running trades, enter the current floating P&L, or leave it blank to save $0."}
      >
        <input id="pnl" className={`input num disabled:opacity-50 ${errors.pnl ? "border-loss" : ""}`} inputMode="decimal"
          placeholder="e.g. 240 or -100" disabled={isBreakeven} value={isBreakeven ? "0" : form.pnl}
          onChange={(e) => setField("pnl", e.target.value)} />
      </Field>
      <Field label="Trade notes" htmlFor="notes" error={errors.notes}>
        <textarea id="notes" className={`input min-h-[90px] resize-y ${errors.notes ? "border-loss" : ""}`}
          placeholder="What did you see? What would you repeat?" value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
      </Field>
    </SidePanel>
  );
}
