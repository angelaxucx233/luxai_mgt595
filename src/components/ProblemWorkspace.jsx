import EquationRootsProblem from './problems/EquationRootsProblem.jsx';
import CoinOutcomesProblem from './problems/CoinOutcomesProblem.jsx';
import CoinEventSelectProblem from './problems/CoinEventSelectProblem.jsx';
import SetBuilderProblem from './problems/SetBuilderProblem.jsx';
import ProbabilityFractionProblem from './problems/ProbabilityFractionProblem.jsx';
import NeverFailTableProblem from './problems/NeverFailTableProblem.jsx';
import IndependenceTestProblem from './problems/IndependenceTestProblem.jsx';
import TreeBuilderProblem from './problems/TreeBuilderProblem.jsx';
import UrnConditionalProblem from './problems/UrnConditionalProblem.jsx';

const COMPONENTS = {
  equation_roots: EquationRootsProblem,
  coin_outcomes: CoinOutcomesProblem,
  coin_event_select: CoinEventSelectProblem,
  set_builder: SetBuilderProblem,
  probability_fraction: ProbabilityFractionProblem,
  never_fail_table: NeverFailTableProblem,
  independence_test: IndependenceTestProblem,
  tree_builder: TreeBuilderProblem,
  urn_conditional: UrnConditionalProblem,
};

export function ProblemRenderer({ templateId }) {
  const Component = COMPONENTS[templateId];
  if (!Component) {
    return <p className="text-slate-500 text-sm">Unknown problem template: {templateId}</p>;
  }
  return <Component />;
}
