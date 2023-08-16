import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Link,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  showFooter?: boolean;
  children: ReactNode;
  imgUrl?:string
}

export function ModalViewImage({
  isOpen,
  onClose,
  showFooter = false,
  children,
  imgUrl= ''
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='full'>
      <ModalOverlay />
      <ModalContent
        background="pGray.900"
        mx="auto"
        w="auto"
        h="auto"
        maxW={['225px', '450px', '900px']}
        maxH={['150px', '300px', '600px']}
      >
        <ModalBody p="10">{children}</ModalBody>
        {showFooter && (
          <ModalFooter color="pGray.50" py="0.5rem" px="2.5">
            <Link
              href={`${process.env.BASE_URL}images/${imgUrl}`}
              target="_blank"
              fontSize="smaller"
              mr="auto"
            >
              View original
            </Link>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
