import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../../config/colors';
import { convertLocaleToNumber, convertToLocaleString, satToUsd } from '../../../helpers';
import type { Props } from './propsType';

interface styledProps {
  color?: any;
  borderColor?: string;
}

const InputOuterBox = styled.div<styledProps>`
  position: relative;
  margin-bottom: 16px;
  .inputText {
    height: 45px;
    width: 100%;
    font-size: 14px;
    color: ${(p: any) => p.color && p.color.pureBlack};
    border: 1px solid ${(p: any) => p.borderColor && p.borderColor};
    border-radius: 4px;
    outline: none;
    padding-left: 16px;
    font-family: 'Barlow';
    font-weight: 500;
    color: #3c3f41;
    letter-spacing: 0.01em;

    :active {
      border: 1px solid ${(p: any) => p.color && p.color.blue2} !important;
    }
    :focus-visible {
      border: 1px solid ${(p: any) => p.color && p.color.blue2} !important;
    }
  }
  .USD {
    font-family: 'Barlow';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 30px;
    display: flex;
    align-items: center;
    color: ${(p: any) => p.color && p.color.grayish.G300};
    border: 3px solid ${(p: any) => p.color && p.color.pureWhite};
    margin-left: 16px;
  }
`;
export default function NumberInputNew({
  error,
  label,
  name,
  value,
  handleChange,
  handleBlur,
  handleFocus,
  values
}: Props) {
  let labeltext = label;

  const numValue = String(value).includes(',') ? convertLocaleToNumber(value) : value;
  const stringValue = value
    ? String(value).includes(',')
      ? value
      : convertToLocaleString(value)
    : '';
  if (error) labeltext = `${labeltext}*`;

  const color = colors['light'];
  const [isError, setIsError] = useState<boolean>(false);
  const [numberValue, setNumberValue] = useState(numValue);
  const [textValue, setTextValue] = useState(stringValue);

  useEffect(() => {
    if (textValue) {
      setIsError(false);
    }
  }, [textValue]);

  if (name === 'stakeMin' && values?.estimated_session_length === undefined) {
    return <></>;
  }

  return (
    <InputOuterBox color={color} borderColor={isError ? color.red2 : color.grayish.G600}>
      <input
        className="inputText"
        id={name}
        type={'text'}
        value={textValue}
        placeholder={'0'}
        onFocus={handleFocus}
        onBlur={() => {
          handleBlur();
          if (error) {
            setIsError(true);
          }
        }}
        onChange={(e: any) => {
          const realNumber = convertLocaleToNumber(e.target.value);
          if (realNumber > 0) {
            const formattedValue = convertToLocaleString(realNumber);
            handleChange(formattedValue);
            setTextValue(formattedValue);
            setNumberValue(realNumber);
          } else {
            handleChange('');
            setTextValue('');
            setNumberValue(0);
          }
        }}
      />
      <label
        htmlFor={name}
        className="text"
        onClick={handleFocus}
        style={{
          position: 'absolute',
          left: 18,
          fontFamily: 'Barlow',
          top: -9,
          fontSize: 12,
          color: color.grayish.G300,
          background: color.pureWhite,
          fontWeight: '500',
          transition: 'all 0.5s'
        }}
      >
        {labeltext}
      </label>
      <div className="USD">{satToUsd(Number(numberValue))} USD</div>
    </InputOuterBox>
  );
}
