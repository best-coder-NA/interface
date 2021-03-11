import React from 'react'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { CAVAX, Token } from '@pangolindex/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo } from '../../state/stake/hooks'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
// import useUSDCPrice from '../../utils/useUSDCPrice'
import { PNG } from '../../constants'

const Wrapper = styled(AutoColumn) <{ showBackground: boolean; bgColor: any }>`
   border-radius: 12px;
   width: 100%;
   overflow: hidden;
   position: relative;
   border-radius: 1px solid black;
 `

const TopSection = styled.div`
   display: grid;
   grid-template-columns: 48px 1fr 120px;
   grid-gap: 0px;
   align-items: center;
   padding: 1rem;
   z-index: 1;
   ${({ theme }) => theme.mediaWidth.upToSmall`
     grid-template-columns: 48px 1fr 96px;
   `};
 `

export default function IceQueenPool({ stakingInfo }: { stakingInfo: StakingInfo }) {
	const token0 = stakingInfo.tokens[0]
	const token1 = stakingInfo.tokens[1]

	const currency0 = unwrappedToken(token0)
	const currency1 = unwrappedToken(token1)

	const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

	const avaxPool = currency0 === CAVAX || currency1 === CAVAX
	let token: Token
	if (avaxPool) {
		token = currency0 === CAVAX ? token1 : token0
	} else {
		token = token0.equals(PNG[token0.chainId]) ? token1 : token0
	}
	// let valueOfTotalStakedAmountInUSDC: CurrencyAmount | undefined
	// get the color of the token
	let backgroundColor = useColor(token)
	
	// let usdToken: Token
	// const USDPrice = useUSDCPrice(usdToken)
	// valueOfTotalStakedAmountInUSDC =
	// valueOfTotalStakedAmountInWavax && USDPrice?.quote(valueOfTotalStakedAmountInWavax)
	return (
		<Wrapper showBackground={isStaking} bgColor={backgroundColor}>
			<CardBGImage desaturate />
			<CardNoise />

			<TopSection>
				<DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
				<TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
					{currency0.symbol}-{currency1.symbol}
				</TYPE.white>

				<StyledInternalLink to={`/icequeen/${currencyId(currency0)}/${currencyId(currency1)}`} style={{ width: '100%' }}>
					<ButtonPrimary padding="8px" borderRadius="8px">
						{isStaking ? 'Manage' : 'Deposit'}
					</ButtonPrimary>
				</StyledInternalLink>
			</TopSection>
		</Wrapper>
	)
}