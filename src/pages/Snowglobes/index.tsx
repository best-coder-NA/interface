import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { useStakingInfo } from '../../state/stake/snowglobehooks'
import { TYPE } from '../../theme'
import Snowglobe from '../../components/earn/Snowglobe'
import { RowBetween } from '../../components/Row'


const PageWrapper = styled(AutoColumn)`
   max-width: 640px;
   width: 100%;
 `

const PoolSection = styled.div`
   display: grid;
   grid-template-columns: 1fr;
   column-gap: 10px;
   row-gap: 15px;
   width: 100%;
   justify-self: center;
 `

export default function Icequeen() {
	const stakingInfos = useStakingInfo()

	const DataRow = styled(RowBetween)`
     ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
   `};
   `
	return (
		<PageWrapper gap="lg" justify="center">

			<AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
				<DataRow style={{ alignItems: 'baseline' }}>
					<TYPE.mediumHeader style={{ marginTop: '0.5rem', fontSize: '30px' }}>Snowglobes 🌐</TYPE.mediumHeader>
				</DataRow>
				<DataRow style={{ alignItems: 'baseline' }}>
					<TYPE.mediumHeader style={{ marginTop: '0.5rem', fontSize: '15px' }}>Deposit LP tokens into Snowglobes for automatic compounding. Save on gas fees and earn higher APY!</TYPE.mediumHeader>
				</DataRow>
				<PoolSection>
					{(
						stakingInfos?.map(
								stakingInfo => {
									return <Snowglobe key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
								}
							)
					)}
				</PoolSection>
			</AutoColumn>
		</PageWrapper>
	)
}