import ScenarioCardGrid from './ScenarioCardGrid.jsx';
import FairCoinRow from './FairCoinRow.jsx';
import UrnBallsVisual from './UrnBallsVisual.jsx';
import ConditionalIntroVisual from './ConditionalIntroVisual.jsx';
import SampleSpaceShrinker from './SampleSpaceShrinker.jsx';
import ConditionalCountingVisual from './ConditionalCountingVisual.jsx';
import CoinTossSim from './CoinTossSim.jsx';
import MathTooltipText from './MathTooltipText.jsx';
import SampleSpaceGrid from './SampleSpaceGrid.jsx';
import VennDiagram from './VennDiagram.jsx';
import ProbabilitySlider from './ProbabilitySlider.jsx';
import MathAccumulator from './MathAccumulator.jsx';
import NeverFailTableDemo from './NeverFailTableDemo.jsx';
import ComplementBar from './ComplementBar.jsx';
import ScenarioCompare from './ScenarioCompare.jsx';
import InteractiveTreeDiagram from './InteractiveTreeDiagram.jsx';
import StaticTreeDiagram from './StaticTreeDiagram.jsx';
import UrnDrawSim from './UrnDrawSim.jsx';
import BinomialCdfComplementProblem from './BinomialCdfComplementProblem.jsx';
import BinomialFormulaBuilder from './BinomialFormulaBuilder.jsx';
import BinomialFormulaReveal from './BinomialFormulaReveal.jsx';
import BinomialPmfExplainer from './BinomialPmfExplainer.jsx';

import UtilityCurveExplorer from './UtilityCurveExplorer.jsx';
import CdfDominanceExplorer from './CdfDominanceExplorer.jsx';
import ReturnDistributionLab from './ReturnDistributionLab.jsx';
import DiversificationLab from './DiversificationLab.jsx';
import FrontierExplorer from './FrontierExplorer.jsx';
import EfficientSetMath from './EfficientSetMath.jsx';
import EstimationRiskSim from './EstimationRiskSim.jsx';
import SmlExplorer from './SmlExplorer.jsx';
import QuantNumericProblem from './QuantNumericProblem.jsx';

const VISUALS = {
  UtilityCurveExplorer,
  CdfDominanceExplorer,
  ReturnDistributionLab,
  DiversificationLab,
  FrontierExplorer,
  EfficientSetMath,
  EstimationRiskSim,
  SmlExplorer,
  QuantNumericProblem,
  ScenarioCardGrid,
  FairCoinRow,
  UrnBallsVisual,
  ConditionalIntroVisual,
  SampleSpaceShrinker,
  ConditionalCountingVisual,
  CoinTossSim,
  MathTooltipText,
  SampleSpaceGrid,
  VennDiagram,
  ProbabilitySlider,
  MathAccumulator,
  NeverFailTableDemo,
  ComplementBar,
  ScenarioCompare,
  InteractiveTreeDiagram,
  StaticTreeDiagram,
  UrnDrawSim,
  BinomialCdfComplementProblem,
  BinomialFormulaBuilder,
  BinomialFormulaReveal,
  BinomialPmfExplainer,
};

export default function SlideVisual({ id, visualProps }) {
  const Component = VISUALS[id];
  if (!Component) {
    return <p className="text-slate-500 text-sm">Visual not implemented: {id}</p>;
  }
  return <Component {...(visualProps ?? {})} />;
}
