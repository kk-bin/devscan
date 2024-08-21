import cx from 'classnames';

import s from './index.module.scss';

export default function IconAndTitle({
  icon = '', value, className = ''
}: {
  icon?: any,
  value?: any,
  className?: string
}) {
  return (
    <div className={cx(s.wrap, className)}>
      {icon ? (typeof icon === 'string' ? <img src={icon} /> : icon) : null }
      <span>{value}</span>
    </div>
  );
};