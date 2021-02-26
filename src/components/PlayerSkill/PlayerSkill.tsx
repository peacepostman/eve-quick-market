import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import find from 'lodash/find';
import { toast } from 'react-toastify';

import getSelectStyle from './../../helpers/getSelectStyle';
import { TabItem } from './../Tabs';
import Input from './../Input';
import { PlayerSkillSidebar, PlayerSkillFormControl, PlayerSkillFormLabel, PlayerSkillFormSend, PlayerSkillFormHelper } from './PlayerSkill.styled';

interface Props {
  playerSkill: any;
  setPlayerSkill(data: any): any;
}

const PlayerSkill = (props: Props) => {
  const { playerSkill, setPlayerSkill } = props;
  const [accountingLevel, setAccountingLevel] = useState<any>();
  const [minimumMargin, setMinimumMargin] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const options: any = [
    { value: 5, label: 'Level 0 (5%)' },
    { value: 4.45, label: 'Level 1 (4.45%)' },
    { value: 3.9, label: 'Level 2 (3.9%)' },
    { value: 3.35, label: 'Level 3 (3.35%)' },
    { value: 2.8, label: 'Level 4 (2.8%)' },
    { value: 2.25, label: 'Level 5 (2.25%)' },
  ];
  const sidebarRef = useRef<any>(null);

  useEffect(() => {
    if (playerSkill) {
      if (playerSkill.accountingLevel) {
        setAccountingLevel(find(options, { value: playerSkill.accountingLevel }));
      } else {
        setAccountingLevel(options[0]);
      }

      if (playerSkill.minimumMargin) {
        setMinimumMargin(playerSkill.minimumMargin);
      } else {
        setMinimumMargin(10);
      }
    }
  }, [playerSkill]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', closeListener);
      document.addEventListener('mousedown', clickOutside);
      document.addEventListener('touchstart', clickOutside);

      return () => {
        document.removeEventListener('keydown', closeListener);
        document.removeEventListener('mousedown', clickOutside);
        document.removeEventListener('touchstart', clickOutside);
      };
    }
  }, [isOpen]);

  function closeListener(e: any) {
    const { keyCode } = e;
    if (isOpen && keyCode === 27) {
      setIsOpen(false);
      return;
    }
  }

  function clickOutside(e: any) {
    if (!sidebarRef.current || sidebarRef.current.contains(e.target)) {
      return;
    }
    if (isOpen) {
      setIsOpen(false);
    }
  }

  function openPlayerSkill(e: any) {
    e.preventDefault();
    setIsOpen((prev: any) => !prev);
  }

  function save() {
    setPlayerSkill({
      accountingLevel: accountingLevel && accountingLevel.value ? accountingLevel.value : null,
      minimumMargin: minimumMargin ? minimumMargin : 10,
    });
    toast.success('Configuration saved', {
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setIsOpen((prev: any) => !prev);
  }

  function onChangeAccounting(val: any) {
    setAccountingLevel(val);
  }

  function onChangeMinimumMargin(e: any) {
    setMinimumMargin(e.target.value);
  }

  return (
    <>
      <TabItem isActive={isOpen} onClick={openPlayerSkill} style={{ marginTop: 'auto' }}>
        <img src="img/augmentations.png" className="main" />
        <img src="img/augmentations.png" className="glow" />
      </TabItem>
      <PlayerSkillSidebar isOpen={isOpen} ref={sidebarRef}>
        <PlayerSkillFormControl>
          <PlayerSkillFormLabel>Skill Accounting level</PlayerSkillFormLabel>
          <Select
            styles={getSelectStyle}
            options={options}
            defaultValue={options[0]}
            value={accountingLevel}
            placeholder="Select accounting level"
            onChange={onChangeAccounting}
          />
        </PlayerSkillFormControl>

        <PlayerSkillFormControl>
          <PlayerSkillFormLabel>Minimum margin (in percent)</PlayerSkillFormLabel>
          <Input
            value={minimumMargin}
            type="number"
            defaultValue={10}
            placeholder="Select minimum margin (in percent)"
            onChange={onChangeMinimumMargin}
          />
          <PlayerSkillFormHelper>Minimum gap in percent between first sell order and second one</PlayerSkillFormHelper>
        </PlayerSkillFormControl>
        <PlayerSkillFormSend onClick={save}>Save</PlayerSkillFormSend>
      </PlayerSkillSidebar>
    </>
  );
};

export default PlayerSkill;
