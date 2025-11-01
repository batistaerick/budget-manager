import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Tooltip from './Tooltip.component';

const getTooltipElement: () => HTMLElement = (): HTMLElement =>
  screen.getByText('Sample tooltip');

describe('Tooltip component', (): void => {
  it('renders tooltip text', (): void => {
    render(
      <Tooltip tooltip="Sample tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(getTooltipElement()).toBeInTheDocument();
  });

  it('renders children correctly', (): void => {
    render(
      <Tooltip tooltip="Sample tooltip">
        <span>Child element</span>
      </Tooltip>
    );

    expect(screen.getByText('Child element')).toBeInTheDocument();
  });

  it.each([
    ['top', /bottom-full left-1\/2 -translate-x-1\/2 mb-1/],
    ['bottom', /top-full left-1\/2 -translate-x-1\/2 mt-1/],
    ['right', /left-full top-1\/2 -translate-y-1\/2 ml-2/],
    ['left', /right-full top-1\/2 -translate-y-1\/2 mr-2/],
  ])(
    'applies correct placement classes when placement="%s"',
    (placement: string, expectedRegex: RegExp): void => {
      render(
        <Tooltip
          tooltip="Sample tooltip"
          placement={
            placement as 'top' | 'bottom' | 'right' | 'left' | undefined
          }
        >
          <span>Hover me</span>
        </Tooltip>
      );

      expect(getTooltipElement().className).toMatch(expectedRegex);
    }
  );

  it('has opacity transition classes', (): void => {
    render(
      <Tooltip tooltip="Sample tooltip">
        <span>Hover me</span>
      </Tooltip>
    );

    const tooltip: HTMLElement = getTooltipElement();
    expect(tooltip.className).toContain('opacity-0');
    expect(tooltip.className).toContain('group-hover:opacity-100');
  });

  it('has correct base styling classes', (): void => {
    render(
      <Tooltip tooltip="Sample tooltip">
        <span>Hover me</span>
      </Tooltip>
    );

    const tooltip: HTMLElement = getTooltipElement();
    expect(tooltip.className).toContain('absolute');
    expect(tooltip.className).toContain('rounded-md');
    expect(tooltip.className).toContain('bg-sky-950');
    expect(tooltip.className).toContain('text-white');
  });
});
