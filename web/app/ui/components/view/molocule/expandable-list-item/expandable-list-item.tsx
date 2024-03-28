import ListItem from '../../atom/list-item';
import Accordion from '../accordion';
import { useRef, useState } from 'react';
import IconButton from '../../atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { cn } from '@/app/utils/style';

export default function ExpandableListItem() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleValueChange = (value: string) => {
    if (value === 'item1') {
      setIsOpen(value === 'item1');
    } else {
      setTimeout(() => {
        setIsOpen(false);
      }, 400);
    }
  };

  const handleSelect = () => {
    setSelected(true);
  };

  const handleDeSelect = () => {
    setSelected(false);
  };

  const hoverRender = () => {
    return (
      <IconButton
        aria-label="edit"
        // ref={iconButtonRef}
        // onClick={handleIconButton}
        icon={DotsHorizontalIcon}
        color={'violet'}
        className="mr-5"
      />
    );
  };

  const handleClick = () => {
    if (selected) {
      handleDeSelect();
    } else {
      handleSelect();
    }
  };

  return (
    <Accordion onValueChange={handleValueChange} type="single" collapsible>
      <Accordion.Item ref={ref} className="relative w-full" value="item1">
        <ListItem
          hoverDecorator={
            isOpen
              ? ({ children }) => {
                  return (
                    <div className="invisible absolute right-3 top-0.5 z-10  group-has-[:hover]:visible">
                      <div className="flex items-center justify-center">{children}</div>
                    </div>
                  );
                }
              : undefined
          }
          hoverRender={hoverRender}
        >
          <div
            onClick={handleClick}
            className={cn('h-full w-full rounded-2xl bg-white pl-4 ring-1 ring-blue-200', {
              'bg-blue-200 text-blue-900 opacity-80': selected,
            })}
          >
            <div className="flex items-center p-1 font-bold hover:text-blue-700 hover:opacity-20">선택해주세용</div>
            <Accordion.Content>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="divide-y bg-white hover:bg-white hover:text-black"
              >
                <div>01</div>
                <div>01</div>
                <div>01</div>
              </div>
            </Accordion.Content>
          </div>
        </ListItem>
        <div className={cn('absolute right-3 top-4 z-20 -translate-y-2/4')}>
          <Accordion.Trigger />
        </div>
      </Accordion.Item>
    </Accordion>
  );
}
