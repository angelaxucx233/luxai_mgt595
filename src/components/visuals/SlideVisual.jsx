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
import EverywhereLab from './EverywhereLab.jsx';
import TsmomLab from './TsmomLab.jsx';
import SportsLab from './SportsLab.jsx';
import CarryLab from './CarryLab.jsx';
import FxCrashLab from './FxCrashLab.jsx';
import GlobalCarryLab from './GlobalCarryLab.jsx';
import TcostLab from './TcostLab.jsx';
import MarketImpactLab from './MarketImpactLab.jsx';
import LiquidityLab from './LiquidityLab.jsx';
import ProfitabilityLab from './ProfitabilityLab.jsx';
import BabLab from './BabLab.jsx';
import QmjLab from './QmjLab.jsx';
import BuffettDecomposer from './BuffettDecomposer.jsx';
import SharpeUncertaintyLab from './SharpeUncertaintyLab.jsx';
import MultipleTestingLab from './MultipleTestingLab.jsx';
import DecayLab from './DecayLab.jsx';
import FactorGauntlet from './FactorGauntlet.jsx';
import LsvLab from './LsvLab.jsx';
import Ff96Scoreboard from './Ff96Scoreboard.jsx';
import CharCovLab from './CharCovLab.jsx';
import ValueDrawdownLab from './ValueDrawdownLab.jsx';
import MomentumLab from './MomentumLab.jsx';
import MomentumEvidence from './MomentumEvidence.jsx';
import CrashLab from './CrashLab.jsx';
import UnderreactionGallery from './UnderreactionGallery.jsx';
import SystematicRiskLab from './SystematicRiskLab.jsx';
import FamaMacbethLab from './FamaMacbethLab.jsx';
import CrossSectionExplorer from './CrossSectionExplorer.jsx';
import GrsGeometry from './GrsGeometry.jsx';
import FactorBuilder from './FactorBuilder.jsx';
import EventStudyLab from './EventStudyLab.jsx';
import EfficiencyForms from './EfficiencyForms.jsx';
import RandomWalkLab from './RandomWalkLab.jsx';
import EfficiencyDebate from './EfficiencyDebate.jsx';
import AnomalyGallery from './AnomalyGallery.jsx';
import StubCalculator from './StubCalculator.jsx';

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
  EverywhereLab,
  TsmomLab,
  SportsLab,
  CarryLab,
  FxCrashLab,
  GlobalCarryLab,
  TcostLab,
  MarketImpactLab,
  LiquidityLab,
  ProfitabilityLab,
  BabLab,
  QmjLab,
  BuffettDecomposer,
  SharpeUncertaintyLab,
  MultipleTestingLab,
  DecayLab,
  FactorGauntlet,
  LsvLab,
  Ff96Scoreboard,
  CharCovLab,
  ValueDrawdownLab,
  MomentumLab,
  MomentumEvidence,
  CrashLab,
  UnderreactionGallery,
  SystematicRiskLab,
  FamaMacbethLab,
  CrossSectionExplorer,
  GrsGeometry,
  FactorBuilder,
  EventStudyLab,
  EfficiencyForms,
  RandomWalkLab,
  EfficiencyDebate,
  AnomalyGallery,
  StubCalculator,
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
