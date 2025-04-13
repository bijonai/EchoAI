import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export interface DesignerStep {
  step: string;
  problem: string;
  knowledge: string;
  explanation: string;
  conclusion: string;
}

export interface StepBranch {
  steps: DesignerStep[];
  start?: string; // 父支线中起始节点的 step 值
  end?: string;   // 父支线中结束节点的 step 值
}

interface TimelineProps {
  branches?: StepBranch[];
  minGap?: number; // 两个节点之间的最小间距，单位px
}

const DEFAULT_WIDTH = 800;
const DEFAULT_MIN_GAP = 100;

const TEST_DATA: StepBranch[] = [
  // 父支线（根支线）
  {
    steps: [
      { step: 'A', problem: '', knowledge: '', explanation: '', conclusion: '' },
      { step: 'B', problem: '', knowledge: '', explanation: '', conclusion: '' },
      { step: 'C', problem: '', knowledge: '', explanation: '', conclusion: '' },
      { step: 'D', problem: '', knowledge: '', explanation: '', conclusion: '' },
    ]
  },
  // 子支线示例
  {
    start: 'B',
    end: 'C',
    steps: [
      { step: 'b1', problem: '', knowledge: '', explanation: '', conclusion: '' },
      { step: 'b2', problem: '', knowledge: '', explanation: '', conclusion: '' },
      { step: 'b3', problem: '', knowledge: '', explanation: '', conclusion: '' },
      { step: 'b4', problem: '', knowledge: '', explanation: '', conclusion: '' },
      { step: 'b5', problem: '', knowledge: '', explanation: '', conclusion: '' },
    ]
  }
];

export const Timeline: React.FC<TimelineProps> = ({ branches = TEST_DATA, minGap = DEFAULT_MIN_GAP }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!branches || branches.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // 先确定根支线（branches[0]）所需的最小宽度
    const rootSteps = branches[0].steps;
    const rootNodeCount = rootSteps.length;
    // 根支线要求的最小宽度
    let requiredWidth = margin.left + margin.right + (rootNodeCount - 1) * minGap;

    // 遍历子支线，计算如果它们同时设置了 start 与 end，需要的最小svg宽度
    branches.forEach((branch, i) => {
      if (i === 0) return; // 跳过根支线
      if (branch.start && branch.end) {
        const subNodeCount = branch.steps.length;
        // 在父支线中查找 start 与 end 的位置
        const parentSteps = rootSteps;
        const startIndex = parentSteps.findIndex(s => s.step === branch.start);
        const endIndex = parentSteps.findIndex(s => s.step === branch.end);
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          // 当前父支线中该区间的比例：默认情况下父支线映射后该区间宽度为：
          // currentParentGap = (DEFAULT_WIDTH - margin.left - margin.right) * ((endIndex - startIndex) / (rootNodeCount - 1))
          // 子支线要求的宽度至少为：(subNodeCount - 1)*minGap
          // 因此要求:
          // (svgWidth - margin.left - margin.right) * ((endIndex - startIndex) / (rootNodeCount - 1)) >= (subNodeCount - 1)*minGap
          // 解得:
          const candidate = margin.left + margin.right + ((subNodeCount - 1) * minGap * (rootNodeCount - 1)) / (endIndex - startIndex);
          requiredWidth = Math.max(requiredWidth, candidate);
        }
      }
    });

    // svg宽度取默认宽度和计算出的最小宽度中的最大值
    const svgWidth = Math.max(DEFAULT_WIDTH, requiredWidth);

    // 为便于计算，将svg高度设为固定值加上支线数的间距
    const branchCount = branches.length;
    const branchSpacing = 60; // 每条支线之间固定间距
    const svgHeight = margin.top + margin.bottom + branchCount * branchSpacing;

    // 设置svg尺寸
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    // 使用 d3 内置颜色方案，每条支线颜色不同
    const colorScale = d3.scaleOrdinal<string>()
      .domain(branches.map((_, i) => i.toString()))
      .range(d3.schemeCategory10);

    // 计算根支线的 xScale
    const parentXScale = d3.scaleLinear()
      .domain([0, rootNodeCount - 1])
      .range([margin.left, svgWidth - margin.right]);

    // 绘制每条支线
    branches.forEach((branch, branchIndex) => {
      // 每条支线垂直位置：自上而下分布
      const y = margin.top + branchIndex * branchSpacing + branchSpacing / 2;
      const nodeCount = branch.steps.length;

      // 定义 xScale：根支线或子支线的比例尺
      let xScale: d3.ScaleLinear<number, number>;
      // 如果为根支线，使用 parentXScale
      if (branchIndex === 0) {
        xScale = parentXScale;
      } else if (branch.start && branch.end) {
        // 子支线：将范围限制在父支线中与 start/end 对应的区间
        const parentSteps = branches[0].steps;
        const startIndex = parentSteps.findIndex(s => s.step === branch.start);
        const endIndex = parentSteps.findIndex(s => s.step === branch.end);
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const parentStartX = parentXScale(startIndex);
          const parentEndX = parentXScale(endIndex);
          // 如果该区间不足以满足子支线的最小间距，则扩展
          const desiredWidth = (nodeCount - 1) * minGap;
          const rangeWidth = parentEndX - parentStartX;
          const finalRange = Math.max(rangeWidth, desiredWidth);
          xScale = d3.scaleLinear()
            .domain([0, nodeCount - 1])
            .range([parentStartX, parentStartX + finalRange]);
        } else {
          // 如果未找到对应父节点，则默认使用全宽比例尺
          xScale = d3.scaleLinear()
            .domain([0, nodeCount - 1])
            .range([margin.left, svgWidth - margin.right]);
        }
      } else {
        // 没有设置 start/end 的子支线，默认全宽
        xScale = d3.scaleLinear()
          .domain([0, nodeCount - 1])
          .range([margin.left, svgWidth - margin.right]);
      }

      // 构造该支线的节点坐标数据
      const lineData: [number, number][] = branch.steps.map((_, index) => [xScale(index), y]);

      // 生成路径
      const lineGenerator = d3.line<[number, number]>()
        .x(d => d[0])
        .y(d => d[1]);
      const pathD = lineGenerator(lineData) || '';

      // 绘制路径
      svg.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', colorScale(branchIndex.toString()))
        .attr('stroke-width', 2);

      // 绘制每个节点及其文本（只显示 step 字段）
      branch.steps.forEach((step, index) => {
        const cx = lineData[index][0];
        svg.append('circle')
          .attr('cx', cx)
          .attr('cy', y)
          .attr('r', 5)
          .attr('fill', colorScale(branchIndex.toString()));

        svg.append('text')
          .attr('x', cx)
          .attr('y', y - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .text(step.step);
      });
    });
  }, [branches, minGap]);

  // 外层容器设置滚动条，宽度和高度自适应，若 svg 尺寸超出则出现滚动条
  return (
    <div className='w-full h-full'>
      <svg ref={svgRef} className='h-full w-full select-none' />
    </div>
  );
};

export default Timeline;
