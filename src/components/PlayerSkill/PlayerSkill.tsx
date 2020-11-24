import React, { useState, useEffect } from "react";
import Select from "react-select";
import find from "lodash/find";
import { toast } from "react-toastify";

import getSelectStyle from "./../../helpers/getSelectStyle";
import {
  PlayerSkillButton,
  PlayerSkillSidebar,
  PlayerSkillFormControl,
  PlayerSkillFormLabel,
  PlayerSkillFormSend,
} from "./PlayerSkill.styled";

interface Props {
  playerSkill: any;
  setPlayerSkill(data: any): any;
}

const PlayerSkill = (props: Props) => {
  const { playerSkill, setPlayerSkill } = props;
  const [accountingLevel, setAccountingLevel] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const options: any = [
    { value: 5, label: "Level 0 (5%)" },
    { value: 4.45, label: "Level 1 (4.45%)" },
    { value: 3.9, label: "Level 2 (3.9%)" },
    { value: 3.35, label: "Level 3 (3.35%)" },
    { value: 2.8, label: "Level 4 (2.8%)" },
    { value: 2.25, label: "Level 5 (2.25%)" },
  ];

  useEffect(() => {
    if (playerSkill && playerSkill.accountingLevel) {
      setAccountingLevel(find(options, { value: playerSkill.accountingLevel }));
    } else {
      setAccountingLevel(options[0]);
    }
  }, [playerSkill]);

  function openPlayerSkill(e: any) {
    e.preventDefault();
    setIsOpen((prev: any) => !prev);
  }

  function save() {
    setPlayerSkill({
      accountingLevel:
        accountingLevel && accountingLevel.value ? accountingLevel.value : null,
    });
    toast.success("Player skills saved", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function onChangeAccounting(val: any) {
    setAccountingLevel(val);
  }

  return (
    <>
      <PlayerSkillButton isOpen={isOpen} onClick={openPlayerSkill}>
        <img src="img/gear.svg" width="40" height="40" />
      </PlayerSkillButton>
      <PlayerSkillSidebar isOpen={isOpen}>
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
        <PlayerSkillFormSend onClick={save}>Save</PlayerSkillFormSend>
      </PlayerSkillSidebar>
    </>
  );
};

export default PlayerSkill;
