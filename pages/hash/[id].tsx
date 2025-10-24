import React from 'react';
import { Container, Box } from '@mui/material';
import { DOMAINS, HASH_PAGE, characterResponse } from '../../libs';
import { HashTitle } from '../../libs/components/HashTitle';
import { MetaHead } from '../../libs/components/MetaHead';
import { CharacterTable } from '../../libs/components/CharacterTable';

const styleCss = {
  main: {
    marginTop: '85px',
  }
};

const Hash = ({ hash, id }) => {
  const title = id.toString().toUpperCase();
  return (
    <main>
      <Box sx={styleCss.main}>
        <MetaHead
          title={title}
          description={HASH_PAGE.description}
          wowhead={false}
        />
        <Container maxWidth={false}>
          <HashTitle id={id}/>
        </Container>
        <Container maxWidth={false}>
          <CharacterTable characters={hash} roster={false}/>
        </Container>
      </Box>
    </main>
  )
}

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await fetch(encodeURI(`${DOMAINS.domain}/api/osint/character/hash?hash=${id}`));
  const hash = await res.json() as characterResponse[];
  if (!hash || !hash.length) {
    return {
      notFound: true,
    }
  }
  return {
    props: { hash, id },
  }
}

export default Hash;
