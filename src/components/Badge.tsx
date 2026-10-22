import { CheckIcon } from './icons';
import type { InternalBadge } from '../types';

export function Badge({
  badge,
  onClick,
}: {
  badge: InternalBadge;
  onClick?: () => void;
}) {
  return (
    <div
      className={`relative flex w-24 h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 text-center text-[10px] transition ${
        badge.earned
          ? 'border-amber-300 bg-amber-50 text-amber-800'
          : 'border-slate-300 bg-slate-50 text-slate-400 grayscale'
      }`}
      title={badge.description}
      onClick={onClick}
    >
      <span className="text-xl">{badge.icon}</span>
      <span className="mt-1 font-medium">{badge.label}</span>
      {badge.earned && <CheckIcon className="absolute -top-1 -right-1 h-4 w-4 text-emerald-500" />}
    </div>
  );
}
